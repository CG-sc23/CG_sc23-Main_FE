export type HealthCheckResponse = {
  end_point_ok: boolean;
  api_ok: boolean;
};

type OkAndOptionalReason = {
  ok: boolean;
  reason?: string;
};
export type SignUpResponse = OkAndOptionalReason;
export type SignUpEmailVerifyResponse = OkAndOptionalReason;
export type SignUpEmailVerifyConfirmResponse = OkAndOptionalReason;

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

export type SignUpEmailVerifyPayload = { email: string };
export type SignUpEmailVerifyConfirmQuery = { email: string; token: string };
