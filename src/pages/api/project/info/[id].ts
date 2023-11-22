import server from '@/api/server';
import type { GetProjectInfoResponse } from '@/libs/type/client';
import type { NextApiResponse, NextApiRequest } from 'next';

type AuthHeader = `Token ${string}`;
function getTokenFromAuthHeader(authHeader: AuthHeader) {
  const token = authHeader.split(' ').at(1);
  if (!token) return '';

  return token;
}
export default async function handleProjectInfo(
  req: NextApiRequest,
  res: NextApiResponse<GetProjectInfoResponse>,
) {
  if (req.method !== 'GET') return res.status(405).end();

  if (!req.query?.id) return res.status(404).end();
  const id = req.query.id as string;

  const authHeader = req.headers.authorization as AuthHeader;

  const result = await server.getProjectInfo({
    project_id: id,
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
    id: data?.id,
    title: data.title,
    thumbnail_image: data.thumbnail_image,
    short_description: data.short_description,
    due_date: data.due_date,
    description: data?.description,
    description_resource_links: data?.description_resource_links,
    created_at: data?.created_at,
    status: data?.status,
    permission: data?.permission,
    members: data?.members,
    owner: data?.owner,
    milestone: data?.milestone ?? [],
  });
}
