import server from '@/api/server';
import type { UserDetailInfoResponse } from '@/libs/type/client';
import type { NextApiResponse, NextApiRequest } from 'next';

export default async function handleUserDetailInfo(
  req: NextApiRequest,
  res: NextApiResponse<UserDetailInfoResponse>,
) {
  if (req.method !== 'GET') return res.status(405).end();

  if (!req.query?.id) return res.status(404).end();
  const id = req.query.id as string;

  const result = await server.getUserDetailInfo({
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
    email: data.email,
    name: data.name,
    profile_image_link: data.profile_image_link,
    profile_image_updated_at: data.profile_image_updated_at,
    github_link: data.github_link,
    short_description: data.short_description,
    description: data.description,
    description_resource_links: data.description_resource_links,
  });
}
