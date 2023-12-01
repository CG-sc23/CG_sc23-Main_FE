import server from '@/api/server';
import type { GetProjectsInfoResponse } from '@/libs/type/client';
import type { NextApiResponse, NextApiRequest } from 'next';

export default async function handleUserInfo(
  req: NextApiRequest,
  res: NextApiResponse<GetProjectsInfoResponse>,
) {
  if (req.method !== 'GET') return res.status(405).end();

  if (!req.query?.id) return res.status(404).end();
  const id = req.query.id as string;

  const result = await server.getUserProjectsInfo({
    user_id: id,
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
    projects: data.projects,
  });
}
