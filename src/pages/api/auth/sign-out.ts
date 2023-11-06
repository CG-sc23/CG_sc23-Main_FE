import server from '@/api/server';
import type { SignOutResponse } from '@/libs/type/client';
import type { NextApiResponse, NextApiRequest } from 'next';

export default async function handleSocialAuth(
  req: NextApiRequest,
  res: NextApiResponse<SignOutResponse>,
) {
  if (req.method !== 'POST') return res.status(405).end();

  const result = await server.postSignOut(req.body);

  if (result === undefined)
    return res.status(500).json({ ok: false, reason: '서버 통신 없음' });

  if (result.data === undefined)
    return res.status(500).json({ ok: false, reason: '서버 결과 없음' });

  const { data } = result;

  if (!data.success) {
    return res.status(401).json({ ok: false, reason: data.detail });
  }

  return res.status(200).json({ ok: true });
}
