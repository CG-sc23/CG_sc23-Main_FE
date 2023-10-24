import type { DefaultResponse } from '@/api/type';
import type { NextApiResponse, NextApiRequest } from 'next';
import server from '@/api/server';

export default async function handleSignUp(
  req: NextApiRequest,
  res: NextApiResponse<DefaultResponse>,
) {
  try {
    const { status, data } = await server.postSingUp(req.body);

    switch (status) {
      case 201:
        return res.status(201).json({ ok: true });

      case 400:
        return res.status(400).json({ ok: false, value: data.reason! });

      case 500:
        return res.status(500).json({ ok: false, value: data.reason! });

      default:
        throw new Error('Unknown Error: SignUp');
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}
