import type { NextApiResponse, NextApiRequest } from 'next';

import server from '@/api/server';
import { SignUpEmailVerifyResponse } from '@/libs/type/client';

export default async function handleSignUpEmailVerify(
  req: NextApiRequest,
  res: NextApiResponse<SignUpEmailVerifyResponse>,
) {
  if (req.method !== 'POST') return res.status(405).end();

  const result = await server.postSignUpEmailVerify(req.body);

  if (result === undefined)
    return res.status(500).json({ ok: false, reason: '서버 연결 없음' });

  const { data } = result;

  if (!data?.success) {
    return res.status(400).json({ ok: false, reason: data?.reason });
  }

  return res.status(200).json({ ok: true });
}
