import server from '@/api/server';
import type { NextApiResponse, NextApiRequest } from 'next';

export default async function handleGoogleAuth(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  let ret = null;
  try {
    if (req.body.provider === 'GOOGLE') ret = await server.postGoogle(req.body);
    else ret = await server.postKakao(req.body);

    return res.status(ret.status).json(ret.data);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}
