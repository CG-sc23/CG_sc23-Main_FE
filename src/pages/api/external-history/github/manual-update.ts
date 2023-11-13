import server from '@/api/server';
import type { GitHubManualUpdateResponse } from '@/libs/type/client';
import { assert } from '@/libs/utils/assert';
import type { NextApiResponse, NextApiRequest } from 'next';

type AuthHeader = `Token ${string}`;
function getTokenFromAuthHeader(authHeader: AuthHeader) {
  const token = authHeader.split(' ').at(1);
  assert(token, "Can't find token.");

  return token;
}

export default async function handleStack(
  req: NextApiRequest,
  res: NextApiResponse<GitHubManualUpdateResponse>,
) {
  if (req.method !== 'POST') return res.status(405).end();

  console.log(req.headers);
  if (!req.headers.authorization) return res.status(401).end();
  const authHeader = req.headers.authorization as AuthHeader;

  const result = await server.postGitHubManualUpdate({
    token: getTokenFromAuthHeader(authHeader),
  });

  if (result === undefined)
    return res.status(500).json({ ok: false, reason: '서버 통신 없음' });

  if (result.data === undefined)
    return res.status(500).json({ ok: false, reason: '서버 결과 없음' });

  const { data } = result;

  if (!data.success) {
    return res.status(400).json({ ok: false, reason: data.reason });
  }

  return res.status(202).json({
    ok: true,
  });
}
