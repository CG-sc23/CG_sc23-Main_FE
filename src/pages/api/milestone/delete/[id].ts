import server from '@/api/server';
import type { DeleteMileStoneResponse } from '@/libs/type/client';
import type { NextApiResponse, NextApiRequest } from 'next';

type AuthHeader = `Token ${string}`;
function getTokenFromAuthHeader(authHeader: AuthHeader) {
  const token = authHeader?.split(' ').at(1);
  if (!token) return '';

  return token;
}

export default async function handleMileStoneDelete(
  req: NextApiRequest,
  res: NextApiResponse<DeleteMileStoneResponse>,
) {
  if (req.method !== 'DELETE') return res.status(405).end();

  const authHeader = req.headers.authorization as AuthHeader;

  if (!req.query?.id) return res.status(404).end();
  const id = req.query.id as string;

  const result = await server.deleteMilestoneInfo({
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
  });
}
