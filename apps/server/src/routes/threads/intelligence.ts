// --- routes/intelligence.ts ---
import { Hono } from 'hono';
import { z } from 'zod';
import { createDb } from '@/db';
import { notes, associations_notes_deal, deals } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { buildLLMPrompt, parseLLMResponse } from '@/lib/prompt';
import { callOpenAI } from '@/lib/llm';

export const intelligenceRoute = new Hono();

const IntelligenceRequestSchema = z.object({
  threadId: z.string(),
  messages: z.array(z.object({
    id: z.string(),
    sender: z.string(),
    recipients: z.array(z.string()),
    timestamp: z.string(),
    subject: z.string(),
    body: z.string(),
  })),
  contactContext: z.record(z.object({
    name: z.string(),
    title: z.string().optional(),
  })).optional(),
  crmContext: z.object({
    dealId: z.string().optional(),
    accountId: z.string().optional(),
  }).optional(),
});

const AssociateNoteSchema = z.object({
  fingerprint: z.string(),
  dealId: z.string(), // HubSpot ID, numeric string
});

async function waitForNoteId(fingerprint: string, maxWaitMs = 20000, intervalMs = 2000) {
  const db = createDb(process.env.DATABASE_URL!);
  const start = Date.now();
  while (Date.now() - start < maxWaitMs) {
    const [note] = await db
      .select({ id: notes.id })
      .from(notes)
      .where(eq(notes.note_body, fingerprint))
      .limit(1);
    if (note?.id) return note.id;
    await new Promise((res) => setTimeout(res, intervalMs));
  }
  throw new Error('Timed out waiting for note ID');
}

intelligenceRoute.post('/intelligence', async (c) => {
  const db = createDb(process.env.DATABASE_URL!);
  const raw = await c.req.json();
  const parsed = IntelligenceRequestSchema.safeParse(raw);
  if (!parsed.success) return c.json({ error: 'Invalid input' }, 400);

  const { threadId, messages, contactContext, crmContext } = parsed.data;
  const prompt = buildLLMPrompt(messages, contactContext, crmContext);
  const llmOutput = await callOpenAI(prompt);
  const { summary, followUps } = parseLLMResponse(llmOutput);
  const fingerprint = `${summary}\n\n#ts_${Date.now()}`;
  const now = new Date();

  await db.insert(notes).values({
    note_body: fingerprint,
    body_preview: summary,
    html_body_preview: `<html><body>${summary}</body></html>`,
    body_preview_truncated: false,
    create_date: now,
    last_modified_date: now,
    record_source: 'CRM_UI',
    record_creation_source: 'CRM_UI',
    record_creation_source_id: `userId:80123950`,
    user_ids_of_all_owners: '80123950',
  });

  return c.json({ summary, followUps, fingerprint, dealId: crmContext?.dealId });
});

intelligenceRoute.post('/associate-note', async (c) => {
  const db = createDb(process.env.DATABASE_URL!);
  const raw = await c.req.json();
  const parsed = AssociateNoteSchema.safeParse(raw);
  if (!parsed.success) return c.json({ error: 'Invalid input' }, 400);

  const { fingerprint, dealId } = parsed.data;
  const noteId = await waitForNoteId(fingerprint);

  const [deal] = await db
    .select({ id: deals.id })
    .from(deals)
    .where(eq(deals.id, dealId)) // Match against numeric HubSpot ID
    .limit(1);

  if (!deal?.id || isNaN(Number(deal.id))) {
    console.error(`[associate-note] No deal found or deal.id is invalid:`, deal);
    return c.json({ error: 'Deal not found or invalid HubSpot ID' }, 400);
  }

  await db.insert(associations_notes_deal).values({
    notes_id: noteId,
    deal_id: Number(deal.id), // safe since we validated above
    association_type_id: 214,
  });

  return c.json({ status: 'associated', noteId });
});

export default intelligenceRoute;
