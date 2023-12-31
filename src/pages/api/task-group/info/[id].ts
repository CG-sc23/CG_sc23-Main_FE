import server from '@/api/server';
import type { GetTaskGroupAuthResponse } from '@/libs/type/client';
import { assert } from '@/libs/utils/assert';
import type { NextApiResponse, NextApiRequest } from 'next';

type AuthHeader = `Token ${string}`;
function getTokenFromAuthHeader(authHeader: AuthHeader) {
  const token = authHeader?.split(' ').at(1);
  if (!token) return '';

  return token;
}

export default async function handleTaskGroupInfo(
  req: NextApiRequest,
  res: NextApiResponse<GetTaskGroupAuthResponse>,
) {
  if (req.method !== 'GET') return res.status(405).end();

  const authHeader = req.headers.authorization as AuthHeader;

  if (!req.query?.id) return res.status(404).end();
  const id = req.query.id as string;

  const result = await server.getTaskGroupInfo({
    token: getTokenFromAuthHeader(authHeader),
    task_group_id: id,
  });

  if (result === undefined)
    return res.status(500).json({ ok: false, reason: '서버 통신 없음' });

  if (result.data === undefined)
    return res.status(500).json({ ok: false, reason: '서버 결과 없음' });

  const { data } = result;

  if (data.detail) {
    return res.status(401).json({ ok: false, reason: data.detail });
  }
  if (!data.success) {
    return res.status(400).json({ ok: false, reason: data.reason });
  }

  return res.status(200).json({
    ok: true,
    id: data?.id,
    project: data?.project,
    created_by: data?.created_by,
    status: data?.status,
    title: data?.title,
    created_at: data?.created_at,
    due_date: data?.due_date,
    tasks: data?.tasks,
    permission: data?.permission,
    milestone: data?.milestone,
  });
}
