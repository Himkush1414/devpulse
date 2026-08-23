import { Router, Response } from 'express';
import { prisma } from '../db/client';
import { apiKeyAuth, AuthedRequest } from '../middleware/apiKeyAuth';
import { checkRateLimit } from '../middleware/rateLimit';

export const ingestRouter = Router();

const VALID_LEVELS = ['info', 'warn', 'error'];

ingestRouter.post('/', apiKeyAuth, async (req: AuthedRequest, res: Response) => {
  const sourceId = req.source!.id;

  if (!checkRateLimit(sourceId)) {
    return res.status(429).json({ error: 'rate limit exceeded, try again shortly' });
  }

  const { level, message, meta } = req.body;

  if (!level || !VALID_LEVELS.includes(level)) {
    return res.status(400).json({ error: `level must be one of: ${VALID_LEVELS.join(', ')}` });
  }

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'message is required' });
  }

  const log = await prisma.log.create({
    data: {
      sourceId,
      level,
      message,
      meta: meta ?? undefined,
    },
  });

  res.status(201).json(log);
});
