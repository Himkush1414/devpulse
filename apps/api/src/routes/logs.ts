import { Router } from 'express';
import { prisma } from '../db/client';

export const logsRouter = Router();

logsRouter.get('/', async (req, res) => {
  const { sourceId, level, limit, cursor } = req.query;

  const take = Math.min(parseInt((limit as string) || '50', 10), 200);

  const logs = await prisma.log.findMany({
    where: {
      ...(sourceId ? { sourceId: sourceId as string } : {}),
      ...(level ? { level: level as string } : {}),
    },
    orderBy: { createdAt: 'desc' },
    take,
    ...(cursor ? { skip: 1, cursor: { id: cursor as string } } : {}),
  });

  res.json({
    logs,
    nextCursor: logs.length === take ? logs[logs.length - 1].id : null,
  });
});
