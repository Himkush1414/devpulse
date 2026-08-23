import { Router } from 'express';
import crypto from 'crypto';
import { prisma } from '../db/client';

export const sourcesRouter = Router();

function generateApiKey(): string {
  return `dp_${crypto.randomBytes(24).toString('hex')}`;
}

sourcesRouter.post('/', async (req, res) => {
  const { name } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: 'name is required' });
  }

  const source = await prisma.source.create({
    data: {
      name: name.trim(),
      apiKey: generateApiKey(),
    },
  });

  res.status(201).json(source);
});

sourcesRouter.get('/', async (_req, res) => {
  const sources = await prisma.source.findMany({
    orderBy: { createdAt: 'desc' },
  });
  res.json(sources);
});
