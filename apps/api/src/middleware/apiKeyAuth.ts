import { Request, Response, NextFunction } from 'express';
import { prisma } from '../db/client';

export interface AuthedRequest extends Request {
  source?: { id: string; name: string };
}

export async function apiKeyAuth(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  const apiKey = req.header('X-DevPulse-Key');

  if (!apiKey) {
    return res.status(401).json({ error: 'X-DevPulse-Key header is required' });
  }

  const source = await prisma.source.findUnique({ where: { apiKey } });

  if (!source) {
    return res.status(401).json({ error: 'invalid API key' });
  }

  req.source = { id: source.id, name: source.name };
  next();
}
