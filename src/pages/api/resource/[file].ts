import server from '@/api/server';
import type { GetPreSignedURLResponse } from '@/libs/type/client';
import { assert } from '@/libs/utils/assert';
import type { NextApiResponse, NextApiRequest } from 'next';

type AuthHeader = `Token ${string}`;
function getTokenFromAuthHeader(authHeader: AuthHeader) {
  const token = authHeader.split(' ').at(1);
  assert(token, "Can't find token.");

  return token;
}

export default async function handlePreSignedURL(
  req: NextApiRequest,
  res: NextApiResponse<GetPreSignedURLResponse>,
) {
  if (req.method !== 'GET') return res.status(405).end();

  if (!req.headers.authorization) return res.status(401).end();
  const authHeader = req.headers.authorization as AuthHeader;

  if (!req.query?.file) return res.status(404).end();
  const file = req.query.file as string;

  const [file_name, file_type] = file.split('.');
  assert(!!file_name && !!file_type, 'Bad Request');

  const result = await server.getPreSignedURL({
    token: getTokenFromAuthHeader(authHeader),
    file_name,
    file_type,
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
    url: data.url,
    aws_response: data.aws_response,
  });
}
