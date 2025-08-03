// /pages/api/request-logger.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import statsStore from '../lib/statsStore';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await statsStore.increment();
    res.status(200).json({ ok: true, timestamp: Date.now() });
  } catch (error) {
    res.status(500).json({ error: 'Failed to log request' });
  }
}