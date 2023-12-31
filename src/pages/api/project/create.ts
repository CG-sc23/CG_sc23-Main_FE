import server from '@/api/server';
import type {
  CreateProjectResponse,
  CreateProjectAuthTokenAndBody,
} from '@/libs/type/client';
import { assert } from '@/libs/utils/assert';
import type { NextApiResponse, NextApiRequest } from 'next';

type AuthHeader = `Token ${string}`;
function getTokenFromAuthHeader(authHeader: AuthHeader) {
  const token = authHeader.split(' ').at(1);
  assert(token, "Can't find token.");

  return token;
}

export default async function handleCreateProject(
  req: NextApiRequest,
  res: NextApiResponse<CreateProjectResponse>,
) {
  if (req.method !== 'POST') return res.status(405).end();

  if (!req.headers.authorization) return res.status(401).end();
  const authHeader = req.headers.authorization as AuthHeader;

  if (!req.body) return res.status(400).end();
  const body = req.body as CreateProjectAuthTokenAndBody['body'];
  if (!body.title) return res.status(400).end();
  if (!body.thumbnail_image) return res.status(400).end();
  if (!body.due_date) return res.status(400).end();
  if (!body.description) return res.status(400).end();
  if (!body.description_resource_links) return res.status(400).end();

  const result = await server.postCreateProject({
    token: getTokenFromAuthHeader(authHeader),
    body: req.body,
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
    title: data.title,
    thumbnail_image: data.thumbnail_image,
    short_description: data.thumbnail_image,
    due_date: data.due_date,
    description: data?.description,
    description_resource_links: data?.description_resource_links,
    created_at: data?.created_at,
    id: data?.id,
    status: data?.status,
  });
}
