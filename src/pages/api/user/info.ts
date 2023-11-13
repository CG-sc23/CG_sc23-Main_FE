import server from '@/api/server';
import type { GetUserInfoResponse } from '@/libs/type/client';
import { assert } from '@/libs/utils/assert';
import type { NextApiResponse, NextApiRequest } from 'next';

type AuthHeader = `Token ${string}`;
function getTokenFromAuthHeader(authHeader: AuthHeader) {
  const token = authHeader.split(' ').at(1);
  assert(token, "Can't find token.");

  return token;
}

export default async function handleUserInfo(
  req: NextApiRequest,
  res: NextApiResponse<GetUserInfoResponse>,
) {
  if (req.method !== 'GET') return res.status(405).end();

  if (!req.headers.authorization) return res.status(401).end();
  const authHeader = req.headers.authorization as AuthHeader;
  const result = await server.getUserInfo({
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
    id: data.user_id,
    email: data.email,
    name: data.name,
    profileImageLink: data.profile_image_link,
  });
}
