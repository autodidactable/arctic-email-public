import { Hono } from 'hono';
import { createDb } from '../db/index';
import { stages, deals } from '../db/schema';
import { eq, and, asc } from 'drizzle-orm';

const dealStagesRoute = new Hono();

// GET /api/deal-stages
dealStagesRoute.get('/', async (c) => {
  const db = createDb(process.env.DATABASE_URL!); // ✅ moved inside route handler

  try {
    const result = await db
      .select({
        id: stages.id,
        label: stages.label,
      })
      .from(stages)
      .where(
        and(
          eq(stages.object_type, 'deals'),
          eq(stages.pipeline_id, 'default'),
          eq(stages.archived, false)
        )
      )
      .orderBy(asc(stages.displayorder));

    return c.json(result);
  } catch (err) {
    console.error('❌ Error fetching deal stages:', err);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});

// POST /api/deal-stages/update-stage
dealStagesRoute.post('/update-stage', async (c) => {
  const db = createDb(process.env.DATABASE_URL!); // ✅ moved inside route handler

  try {
    const { dealId, stageId } = await c.req.json();

    if (!dealId || !stageId) {
      return c.json({ error: 'Missing dealId or stageId' }, 400);
    }

    await db
      .update(deals)
      .set({ dealstage: stageId })
      .where(eq(deals.stacksync_record_id_rr1kp8, dealId));

    return c.json({ success: true });
  } catch (err) {
    console.error('❌ Error updating deal stage:', err);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});

export default dealStagesRoute;
