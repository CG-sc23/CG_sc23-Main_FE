/** Base */
export type BaseApiResponse = {
  success: boolean;
};
type SuccessAndOptionalReason = BaseApiResponse & {
  reason?: string;
  detail?: string;
};
type AuthToken = { token: string };

/** Auth */
export type SignUpApiResponse = SuccessAndOptionalReason;
export type SignInApiResponse = SuccessAndOptionalReason & Partial<AuthToken>;
export type SignOutApiResponse = { success?: boolean; detail?: string };
export type SignUpEmailVerifyApiResponse = SuccessAndOptionalReason;
export type SignUpEmailVerifyConfirmApiResponse = SuccessAndOptionalReason;
export type PasswordResetApiResponse = SuccessAndOptionalReason;
export type PasswordResetApiPayload = { email: string };
export type PasswordResetCheckApiResponse = SuccessAndOptionalReason;
export type PasswordResetCheckApiQueries = PasswordResetApiPayload & AuthToken;
export type PasswordResetConfirmApiResponse = SuccessAndOptionalReason;
export type PasswordResetConfirmApiPayload = PasswordResetCheckApiQueries & {
  new_password: string;
};
export type SocialAuthApiResponse = BaseApiResponse & {
  is_user?: boolean;
  pre_access_token?: string;
  reason?: string;
} & Partial<AuthToken>;

export type SignInApiPayload = { email: string; password: string };
export type SignOutApiAuthToken = AuthToken;
export type SocialAuthApiPayload = { code: string };

/** USER */
export type DeactivateApiAuthToken = AuthToken;
export type DeactivateApiResponse = { success?: boolean; detail?: string };
export type GetUserInfoApiAuthToken = AuthToken;
export type GetUserInfoApiResponse = {
  success?: boolean;
  user_id?: number;
  email?: string;
  name?: string;
  profile_image_link?: string | null;
  detail?: string;
};
export type UserDetailInfoApiQuery = {
  user_id: string;
};
export type UserDetailInfoApiResponse = {
  success?: boolean;
  email?: string;
  name?: string;
  profile_image_link?: string | null;
  github_link?: string;
  short_description?: string;
  description?: string;
  description_resource_links?: string[];
  provider?: 'our' | 'naver' | 'kakao';
  detail?: string;
};
export type ModifyUserDetailInfoApiAuthTokenAndBody = {
  token: string;
  body: {
    name?: string;
    profile_image_link?: string | null;
    github_link?: string;
    short_description?: string;
    description?: string;
    description_resource_links?: string[];
  };
};
export type ModifyUserDetailInfoApiResponse = SuccessAndOptionalReason;

/** ExternalHistory */
export type CommonStackApiQuery = { stack: string };
export type CommonStackApiResponse = SuccessAndOptionalReason & {
  id?: string;
  url?: string;
};
export type GitHubAccountCheckApiQuery = {
  github_link: string;
};
export type GitHubAccountCheckApiResponse = SuccessAndOptionalReason;
type GITHUB_STATUS = 'IN_PROGRESS' | 'COMPLETE' | 'FAIL';
export type GithubUpdateStatusApiAuthToken = AuthToken;
export type GithubUpdateStatusApiResponse = {
  success?: boolean;
  reason?: string;
  status?: GITHUB_STATUS;
  last_update: string;
};
export type GitHubStackApiQuery = { user_id: string };
export type GitHubStackApiResponse = SuccessAndOptionalReason & {
  count?: number;
  stacks?: {
    [key: string]: number;
  };
};
export type GitHubKeywordApiQuery = { user_id: string };
export type GitHubKeywordApiResponse = SuccessAndOptionalReason & {
  keywords?: { [keyword: string]: number };
};
export type GitHubManualUpdateApiAuthToken = AuthToken;
export type GitHubManualUpdateApiResponse = SuccessAndOptionalReason;

/** RESOURCE */
type AWSResponse = {
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
export type GetPreSignedURLApiParamAndAuthToken = AuthToken & {
  file_name: string;
  file_type: string;
};
export type GetPreSignedURLApiResponse = {
  success?: boolean;
  detail?: string;
  reason?: string;
  url?: string;
  aws_response?: AWSResponse;
};
