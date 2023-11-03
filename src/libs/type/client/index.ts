export type HealthCheckResponse = {
  end_point_ok: boolean;
  api_ok: boolean;
};

export type SignUpResponse = {
  ok: boolean;
  reason?: string;
};

export type Provider = 'KAKAO' | 'NAVER';
export type SocialAuthPayload = {
  code: string;
  provider: Provider;
};
export type SocialAuthResponse = {
  isUser?: boolean;
  token?: string;
  preAccessToken?: string;
  reason?: string;
};
