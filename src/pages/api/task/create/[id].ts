import server from '@/api/server';
import type {
  CreateTaskAuthTokenAndBody,
  CreateTaskAuthResponse,
} from '@/libs/type/client';
import { assert } from '@/libs/utils/assert';
import type { NextApiResponse, NextApiRequest } from 'next';

type AuthHeader = `Token ${string}`;
function getTokenFromAuthHeader(authHeader: AuthHeader) {
  const token = authHeader.split(' ').at(1);
  assert(token, "Can't find token.");

  return token;
}

export default async function handleCreateTask(
  req: NextApiRequest,
  res: NextApiResponse<CreateTaskAuthResponse>,
) {
  if (req.method !== 'POST') return res.status(405).end();

  if (!req.headers.authorization) return res.status(401).end();
  const authHeader = req.headers.authorization as AuthHeader;

  if (!req.query?.id) return res.status(404).end();
  const id = req.query.id as string;

  if (!req.body) return res.status(400).end();
  const body = req.body as CreateTaskAuthTokenAndBody['body'];
  if (!body.title) return res.status(400).end();
  if (!body.tags) return res.status(400).end();
  if (!body.description) return res.status(400).end();

  const result = await server.postCreateTask({
    token: getTokenFromAuthHeader(authHeader),
    body: req.body,
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
    task_id: data?.task_id,
  });
}
