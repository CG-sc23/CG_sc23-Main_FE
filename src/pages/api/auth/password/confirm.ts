import server from '@/api/server';
import type { PasswordResetConfirmResponse } from '@/libs/type/client';
import type { NextApiResponse, NextApiRequest } from 'next';

export default async function handlePasswordResetConfirm(
  req: NextApiRequest,
  res: NextApiResponse<PasswordResetConfirmResponse>,
) {
  if (req.method !== 'PUT') return res.status(405).end();

  const result = await server.putPasswordResetConfirm(req.body);

  if (result === undefined)
    return res.status(500).json({ ok: false, reason: '서버 통신 없음' });

  if (result.data === undefined)
    return res.status(500).json({ ok: false, reason: '서버 결과 없음' });

  const { data } = result;

  if (!data.success && data.reason === 'Invalid token.') {
    return res.status(401).json({ ok: false, reason: data.reason });
  }

  if (!data.success) {
    return res.status(400).json({ ok: false, reason: data.reason });
  }

  return res.status(200).json({ ok: true });
}
