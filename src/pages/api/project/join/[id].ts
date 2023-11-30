import server from '@/api/server';
import type {
  MakeJoinRequestResponse,
  ModifyProjectAuthResponse,
  ViewJoinRequestResponse,
} from '@/libs/type/client';
import { assert } from '@/libs/utils/assert';
import type { NextApiResponse, NextApiRequest } from 'next';

type AuthHeader = `Token ${string}`;
function getTokenFromAuthHeader(authHeader: AuthHeader) {
  const token = authHeader.split(' ').at(1);
  assert(token, "Can't find token.");

  return token;
}

async function getViewJoinProject(
  req: NextApiRequest,
  res: NextApiResponse<ViewJoinRequestResponse>,
) {
  if (!req.headers.authorization) return res.status(401).end();
  const authHeader = req.headers.authorization as AuthHeader;

  if (!req.query?.id) return res.status(404).end();
  const id = req.query.id as string;

  const result = await server.getViewJoinRequest({
    token: getTokenFromAuthHeader(authHeader),
    project_id: id,
  });

  if (result === undefined)
    return res.status(500).json({ ok: false, reason: '서버 통신 없음' });

  if (result.data === undefined)
    return res.status(500).json({ ok: false, reason: '서버 결과 없음' });

  const { data } = result;

  if (data.detail) {
    return res.status(401).json({ ok: false, reason: data.detail });
  }
  if (data.success === false) {
    return res.status(400).json({ ok: false, reason: data.reason });
  }

  return res.status(200).json({
    ok: true,
    result: data?.result,
  });
}

async function postMakeJoinProject(
  req: NextApiRequest,
  res: NextApiResponse<MakeJoinRequestResponse>,
) {
  if (!req.headers.authorization) return res.status(401).end();
  const authHeader = req.headers.authorization as AuthHeader;

  if (!req.query?.id) return res.status(404).end();
  const id = req.query.id as string;

  const result = await server.postMakeJoinRequest({
    token: getTokenFromAuthHeader(authHeader),
    body: req.body,
    project_id: id,
  });

  if (result === undefined)
    return res.status(500).json({ ok: false, reason: '서버 통신 없음' });

  if (result.data === undefined)
    return res.status(500).json({ ok: false, reason: '서버 결과 없음' });

  const { data } = result;

  if (data.detail) {
    return res.status(401).json({ ok: false, reason: data.detail });
  }
  if (data.success === false) {
    return res.status(400).json({ ok: false, reason: data.reason });
  }

  return res.status(200).json({
    ok: true,
  });
}

export default async function handleJoinProject(
  req: NextApiRequest,
  res: NextApiResponse<ModifyProjectAuthResponse>,
) {
  if (req.method === 'GET') return await getViewJoinProject(req, res);
  if (req.method === 'POST') return await postMakeJoinProject(req, res);

  return res.status(405).end();
}
