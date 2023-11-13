/** Base */
export type HealthCheckResponse = {
  end_point_ok: boolean;
  api_ok: boolean;
};

type OkAndOptionalReason = {
  ok: boolean;
  reason?: string;
};

type AuthToken = { token: string };

/** Auth */
export type SignUpResponse = OkAndOptionalReason;
export type SignInResponse = OkAndOptionalReason & Partial<AuthToken>;
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
  preAccessToken?: string;
  reason?: string;
} & Partial<AuthToken>;

export type SignUpEmailVerifyPayload = { email: string };
export type SignUpEmailVerifyConfirmQuery = { email: string } & AuthToken;

/** PASSWORD */
export type PasswordResetResponse = OkAndOptionalReason;
export type PasswordResetPayload = { email: string };
export type PasswordResetCheckResponse = OkAndOptionalReason;
export type PasswordResetCheckQueries = PasswordResetPayload & AuthToken;
export type PasswordResetConfirmResponse = OkAndOptionalReason;
export type PasswordResetConfirmPayload = PasswordResetCheckQueries & {
  new_password: string;
};

/** USER */
export type DeactivateAuthToken = AuthToken;
export type DeactivateResponse = OkAndOptionalReason;
export type GetUserInfoAuthToken = AuthToken;
export type GetUserInfoResponse = OkAndOptionalReason & {
  id?: number;
  number?: string;
  email?: string;
  name?: string;
  profileImageLink?: string | null;
};

/** ExternalHistory */
export type GitHubAccountCheckQuery = {
  github_link: string;
};
export type GitHubAccountCheckResponse = OkAndOptionalReason;
type GITHUB_STATUS = 'IN_PROGRESS' | 'COMPLETE' | 'FAIL';
export type GithubUpdateStatusAuthToken = AuthToken;
export type GithubUpdateStatusResponse = OkAndOptionalReason & {
  status?: GITHUB_STATUS;
  last_update?: string;
};
export type GitHubStackAuthToken = AuthToken;
export type GitHubStackResponse = OkAndOptionalReason & {
  count?: number;
  stacks?: {
    [key: string]: number;
  };
};
export type GitHubManualUpdateAuthToken = AuthToken;
export type GitHubManualUpdateResponse = OkAndOptionalReason;

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
  file_name: string;
  file_type: string;
} & AuthToken;
export type GetPreSignedURLResponse = OkAndOptionalReason & {
  url?: string;
  aws_response?: AWSResponse;
};
