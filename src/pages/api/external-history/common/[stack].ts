import server from '@/api/server';
import type { CommonStackResponse } from '@/libs/type/client';
import type { NextApiResponse, NextApiRequest } from 'next';

export default async function handleCommonStack(
  req: NextApiRequest,
  res: NextApiResponse<CommonStackResponse>,
) {
  if (req.method !== 'GET') return res.status(405).end();

  if (!req.query?.stack) return res.status(404).end();
  const stack = req.query.stack as string;

  const result = await server.getCommonStack({
    stack: stack.replace(' ', '').trim().toLowerCase(),
  });

  if (result === undefined)
    return res.status(500).json({ ok: false, reason: '서버 통신 없음' });

  if (result.data === undefined)
    return res.status(500).json({ ok: false, reason: '서버 결과 없음' });

  const { data } = result;

  if (!data.success) {
    return res.status(401).json({ ok: false, reason: data.reason });
  }

  return res.status(200).json({
    ok: true,
    url: data.url,
  });
}
