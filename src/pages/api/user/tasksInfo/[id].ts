import server from '@/api/server';
import type { GetTasksInfoResponse } from '@/libs/type/client';
import type { NextApiResponse, NextApiRequest } from 'next';

type AuthHeader = `Token ${string}`;
function getTokenFromAuthHeader(authHeader: AuthHeader) {
  const token = authHeader?.split(' ').at(1);
  if (!token) return '';

  return token;
}

export default async function handleUserTasksInfo(
  req: NextApiRequest,
  res: NextApiResponse<GetTasksInfoResponse>,
) {
  if (req.method !== 'GET') return res.status(405).end();

  if (!req.query?.id) return res.status(404).end();
  const id = req.query.id as string;

  if (!req.headers.authorization) return res.status(401).end();
  const authHeader = req.headers.authorization as AuthHeader;

  const result = await server.getUserTasksInfo({
    user_id: id,
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
    tasks: data.tasks,
  });
}
