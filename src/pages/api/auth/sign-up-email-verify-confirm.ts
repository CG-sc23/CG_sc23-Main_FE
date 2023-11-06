import type { NextApiResponse, NextApiRequest } from 'next';

import server from '@/api/server';
import {
  SignUpEmailVerifyConfirmQuery,
  SignUpEmailVerifyConfirmResponse,
} from '@/libs/type/client';

export default async function handleSignUpEmailVerifyConfirm(
  req: NextApiRequest,
  res: NextApiResponse<SignUpEmailVerifyConfirmResponse>,
) {
  if (req.method !== 'GET') return res.status(405).end();

  const result = await server.getSignUpEmailVerifyConfirm(
    req.query as SignUpEmailVerifyConfirmQuery,
  );

  if (result === undefined)
    return res.status(500).json({ ok: false, reason: '서버 연결 없음' });

  const { data } = result;

  if (!data?.success) {
    return res.status(400).json({ ok: false, reason: data?.reason });
  }

  return res.status(200).json({ ok: true });
}
