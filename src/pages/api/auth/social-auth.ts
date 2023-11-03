import server from '@/api/server';
import type { SocialAuthPayload, SocialAuthResponse } from '@/libs/type/client';
import type { NextApiResponse, NextApiRequest } from 'next';

export default async function handleSocialAuth(
  req: NextApiRequest,
  res: NextApiResponse<SocialAuthResponse>,
) {
  if (req.method !== 'POST') return res.status(405).end();
  const { provider, code } = req.body as SocialAuthPayload;

  const result =
    provider === 'KAKAO'
      ? await server.postKakao({ code })
      : await server.postNaver({ code });

  if (result === undefined)
    return res.status(500).json({ reason: '서버 통신 없음' });

  if (result.data === undefined)
    return res.status(500).json({ reason: '서버 결과 없음' });

  const { data } = result;

  if (!data.success) {
    return res.status(500).json({ reason: data.reason });
  }

  if (data.is_user) {
    return res.status(200).json({ isUser: true, token: data.token });
  }

  return res
    .status(200)
    .json({ isUser: false, preAccessToken: data.pre_access_token });
}
