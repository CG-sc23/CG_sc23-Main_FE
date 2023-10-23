import { NextApiResponse, NextApiRequest } from 'next';

type Res = {
  ok: boolean;
  msg: string;
};

export default function example(
  req: NextApiRequest,
  res: NextApiResponse<Res>,
) {
  res.status(200).json({
    ok: true,
    msg: 'example',
  });
}
