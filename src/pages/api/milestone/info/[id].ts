import server from '@/api/server';
import type { GetMilestoneAuthResponse } from '@/libs/type/client';
import type { NextApiResponse, NextApiRequest } from 'next';

type AuthHeader = `Token ${string}`;
function getTokenFromAuthHeader(authHeader: AuthHeader) {
  const token = authHeader?.split(' ').at(1);
  if (!token) return '';

  return token;
}

export default async function handleMileStoneInfo(
  req: NextApiRequest,
  res: NextApiResponse<GetMilestoneAuthResponse>,
) {
  if (req.method !== 'GET') return res.status(405).end();

  const authHeader = req.headers.authorization as AuthHeader;

  if (!req.query?.id) return res.status(404).end();
  const id = req.query.id as string;

  const result = await server.getMilestoneInfo({
    token: getTokenFromAuthHeader(authHeader),
    milestone_id: id,
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
    subject: data?.subject,
    tags: data?.tags,
    created_at: data?.created_at,
    due_date: data?.due_date,
    task_groups: data?.task_groups,
    permission: data?.permission,
  });
}
