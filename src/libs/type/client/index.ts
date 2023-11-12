export type HealthCheckResponse = {
  end_point_ok: boolean;
  api_ok: boolean;
};

type OkAndOptionalReason = {
  ok: boolean;
  reason?: string;
};
export type SignUpResponse = OkAndOptionalReason;
export type SignInResponse = OkAndOptionalReason & { token?: string };
export type SignInPayload = { email: string; password: string };
export type SignOutResponse = OkAndOptionalReason;
export type SignOutAuthToken = { token: string };
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

/** PASSWORD */
export type PasswordResetResponse = OkAndOptionalReason;
export type PasswordResetPayload = { email: string };
export type PasswordResetCheckResponse = OkAndOptionalReason;
export type PasswordResetCheckQueries = PasswordResetPayload & {
  token: string;
};
export type PasswordResetConfirmResponse = OkAndOptionalReason;
export type PasswordResetConfirmPayload = PasswordResetCheckQueries & {
  new_password: string;
};

/** USER */
export type DeactivateAuthToken = { token: string };
export type DeactivateResponse = OkAndOptionalReason;
export type GetUserInfoAuthToken = { token: string };
export type GetUserInfoResponse = OkAndOptionalReason & {
  email?: string;
  name?: string;
  profileImageLink?: string | null;
};

/** RESOURCE */
export type AWSResponse = {
  url: string;
  fields: {
    key: string;
    'x-amz-algorithm': string;
    'x-amz-credential': string;
    'x-amz-date': string;
    policy: string;
    'x-amz-signature': string;
  };
};
export type GetPreSignedURLParamAndAuthToken = {
  token: string;
  file_name: string;
  file_type: string;
};
export type GetPreSignedURLResponse = OkAndOptionalReason & {
  url?: string;
  aws_response?: AWSResponse;
};
