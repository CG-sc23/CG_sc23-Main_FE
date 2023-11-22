// ! Base
export type HealthCheckResponse = {
  end_point_ok: boolean;
  api_ok: boolean;
};

type OkAndOptionalReason = {
  ok: boolean;
  reason?: string;
};

type AuthToken = { token: string };

// ! Auth
export type SignUpResponse = OkAndOptionalReason;
export type SignInResponse = OkAndOptionalReason & Partial<AuthToken>;
export type SignInPayload = { email: string; password: string };
export type SignOutResponse = OkAndOptionalReason;
export type SignOutAuthToken = { token: string };
export type SignUpEmailVerifyResponse = OkAndOptionalReason;
export type SignUpEmailVerifyConfirmResponse = OkAndOptionalReason;

export type Provider = "KAKAO" | "NAVER";
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

// ! PASSWORD
export type PasswordResetResponse = OkAndOptionalReason;
export type PasswordResetPayload = { email: string };
export type PasswordResetCheckResponse = OkAndOptionalReason;
export type PasswordResetCheckQueries = PasswordResetPayload & AuthToken;
export type PasswordResetConfirmResponse = OkAndOptionalReason;
export type PasswordResetConfirmPayload = PasswordResetCheckQueries & {
  new_password: string;
};

// ! USER
export type DeactivateAuthToken = AuthToken;
export type DeactivateResponse = OkAndOptionalReason;
export type GetUserInfoAuthToken = AuthToken;
export type GetUserInfoResponse = OkAndOptionalReason & {
  id?: number;
  email?: string;
  name?: string;
  profileImageLink?: string | null;
  profileImageUpdatedAt?: string | null;
  provider?: "our" | "naver" | "kakao";
};
export type UserDetailInfoQuery = {
  user_id: string;
};
export type UserDetailInfoResponse = OkAndOptionalReason & {
  email?: string;
  name?: string;
  profile_image_link?: string | null;
  profile_image_updated_at?: string | null;
  github_link?: string;
  short_description?: string;
  description?: string;
  description_resource_links?: string[];
  provider?: "our" | "naver" | "kakao";
};
export type ModifyUserDetailInfoAuthTokenAndBody = {
  token: string;
  body: {
    name?: string;
    profile_image_link?: string | null;
    github_link?: string;
    short_description?: string;
    description?: string;
    description_resource_links?: string;
  };
};
export type ModifyUserDetailInfoResponse = OkAndOptionalReason;

// ! ExternalHistory
export type CommonStackQuery = { stack: string };
export type CommonStackResponse = OkAndOptionalReason & {
  url?: string;
};
export type GitHubAccountCheckQuery = {
  github_link: string;
};
export type GitHubAccountCheckResponse = OkAndOptionalReason;
type GITHUB_STATUS = "IN_PROGRESS" | "COMPLETE" | "FAIL";
export type GithubUpdateStatusAuthToken = {
  user_id: string;
};
export type GithubUpdateStatusResponse = OkAndOptionalReason & {
  status?: GITHUB_STATUS;
  last_update?: string;
};
export type GitHubStackQuery = { user_id: string };
export type GitHubStackResponse = OkAndOptionalReason & {
  count?: number;
  stacks?: {
    [key: string]: number;
  };
};
export type GitHubKeywordQuery = { user_id: string };
export type GitHubKeywordResponse = OkAndOptionalReason & {
  keywords?: { [keyword: string]: number };
};
export type GitHubManualUpdateAuthToken = AuthToken;
export type GitHubManualUpdateResponse = OkAndOptionalReason;

// ! RESOURCE
export type AWSResponse = {
  url: string;
  fields: {
    key: string;
    "x-amz-algorithm": string;
    "x-amz-credential": string;
    "x-amz-date": string;
    policy: string;
    "x-amz-signature": string;
  };
};
export type GetPreSignedURLParamAndAuthToken = {
  file_name: string;
  type: "resource" | "profile";
} & AuthToken;
export type GetPreSignedURLResponse = OkAndOptionalReason & {
  url?: string;
  aws_response?: AWSResponse;
};

// ! PROJECT
export type ProjectStatus =
  | "READY"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "TERMINATED";
type ProjectPermission = "OWNER" | "MANAGER" | "MEMBER" | "NOTHING";
export type Member = {
  id: number;
  name: string;
  email: string;
  profile_image_link: string | null;
  profile_image_updated_at: string | null;
};
type Milestone = {
  id: number;
  subject: string;
  tags: string[];
};
export type Project = {
  id: number;
  title: string;
  status: ProjectStatus;
  created_at: string;
  due_date: string;
  thumbnail_image: string;
  short_description: string;
  members: Member[];
  description?: string;
  description_resource_links?: string;
  permission?: ProjectPermission;
  owner?: Member;
  milestone?: Milestone[];
};
export type CreateProjectAuthTokenAndBody = AuthToken & {
  body: {
    title?: string;
    short_description?: string;
    description?: string;
    description_resource_links?: string;
    due_date?: string;
    thumbnail_image?: string;
  };
};
export type CreateProjectResponse = OkAndOptionalReason & {
  project_id?: number;
  status?: string;
  created_at?: string;
  title?: string;
  short_description?: string;
  description?: string;
  description_resource_links?: string;
  due_date?: string;
  thumbnail_image?: string;
};
export type GetProjectInfoPartialAuthTokenAndBody = Partial<AuthToken> & {
  project_id: string;
};
export type GetProjectInfoResponse = OkAndOptionalReason & Partial<Project>;
export type GetAllProjectInfoResponse = OkAndOptionalReason & {
  count?: number;
  projects?: Project[];
};
