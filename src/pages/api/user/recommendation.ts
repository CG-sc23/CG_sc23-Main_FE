import server from '@/api/server';
import type { RecommendedUserResponse } from '@/libs/type/client';
import { assert } from '@/libs/utils/assert';
import type { NextApiResponse, NextApiRequest } from 'next';

type AuthHeader = `Token ${string}`;
function getTokenFromAuthHeader(authHeader: AuthHeader) {
  const token = authHeader?.split(' ').at(1);
  if (!token) return '';

  return token;
}

export default async function handleModifyUserInfo(
  req: NextApiRequest,
  res: NextApiResponse<RecommendedUserResponse>,
) {
  if (req.method !== 'GET') return res.status(405).end();

  const authHeader = req.headers.authorization as AuthHeader;
  const result = await server.getUserRecommendation({
    token: getTokenFromAuthHeader(authHeader),
  });

  if (result === undefined)
    return res.status(500).json({ ok: false, reason: '서버 통신 없음' });

  if (result.data === undefined)
    return res.status(500).json({ ok: false, reason: '서버 결과 없음' });

  const { data } = result;

  if (!data.success) {
    return res.status(401).json({ ok: false, reason: data.detail });
  }

  return res.status(200).json({
    ok: true,
    users: data.users,
  });
}
