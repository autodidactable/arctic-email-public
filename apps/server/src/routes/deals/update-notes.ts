// apps/server/src/routes/deals/update-notes.ts
import { Hono } from 'hono';
import { z } from 'zod';
import { createDb } from '@/db';
import { deals } from '@/db/schema';
import { eq } from 'drizzle-orm';

const updateNotesRoute = new Hono();

updateNotesRoute.post('/update-notes', async (c) => {
  const dealId = c.req.param('id'); // comes from /deals/:id/update-notes
  if (!dealId) return c.json({ error: 'Missing deal ID' }, 400);

  const body = await c.req.json();
  const { notes } = z.object({ notes: z.string().min(1) }).parse(body);

  const db = createDb(process.env.DATABASE_URL!);

  await db
    .update(deals)
    .set({ description: notes }) // or use `notes` if you later add that column
    .where(eq(deals.stacksync_record_id_rr1kp8, dealId)); // ✅ use real primary key

  return c.json({ success: true });
});

export default updateNotesRoute;
