import server from '@/api/server';
import type { GithubUpdateStatusResponse } from '@/libs/type/client';
import type { NextApiResponse, NextApiRequest } from 'next';

export default async function handleUpdateStatus(
  req: NextApiRequest,
  res: NextApiResponse<GithubUpdateStatusResponse>,
) {
  if (req.method !== 'GET') return res.status(405).end();

  if (!req.query?.user_id) return res.status(404).end();
  const user_id = req.query.user_id as string;

  const result = await server.getGitHubUpdateStatus({
    user_id,
  });

  if (result === undefined)
    return res.status(500).json({ ok: false, reason: '서버 통신 없음' });

  if (result.data === undefined)
    return res.status(500).json({ ok: false, reason: '서버 결과 없음' });

  const { data } = result;

  if (!data.success) {
    return res.status(404).json({ ok: false, reason: data.reason });
  }

  return res.status(200).json({
    ok: true,
    status: data.status,
    last_update: data.last_update,
  });
}
