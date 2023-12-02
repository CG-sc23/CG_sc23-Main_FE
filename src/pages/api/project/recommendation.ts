import server from '@/api/server';
import type { RecommendProjectResponse } from '@/libs/type/client';
import type { NextApiResponse, NextApiRequest } from 'next';

type AuthHeader = `Token ${string}`;
function getTokenFromAuthHeader(authHeader: AuthHeader) {
  const token = authHeader?.split(' ').at(1);
  if (!token) return '';

  return token;
}

export default async function handleMakeInvite(
  req: NextApiRequest,
  res: NextApiResponse<RecommendProjectResponse>,
) {
  if (req.method !== 'GET') return res.status(405).end();

  const authHeader = req.headers.authorization as AuthHeader;

  const result = await server.getRecommendedProject({
    token: getTokenFromAuthHeader(authHeader),
  });

  if (result === undefined)
    return res.status(500).json({ ok: false, reason: '서버 통신 없음' });

  if (result.data === undefined)
    return res.status(500).json({ ok: false, reason: '서버 결과 없음' });

  const { data } = result;

  if (data.detail) {
    return res.status(401).json({ ok: false, reason: data.detail });
  }
  if (data.success === false) {
    return res.status(400).json({ ok: false, reason: data.reason });
  }

  return res.status(200).json({
    ok: true,
    projects: data?.projects,
  });
}
