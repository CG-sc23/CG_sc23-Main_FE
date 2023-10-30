import type { NextApiResponse, NextApiRequest } from 'next';
import server from '@/api/server';

export default async function handleSignUp(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  let ret = null;
  try {
    if (req.body.preAccessToken) ret = await server.postSocialSingUp(req.body);
    else ret = await server.postSingUp(req.body);

    return res.status(ret.status).json(ret.data);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}
