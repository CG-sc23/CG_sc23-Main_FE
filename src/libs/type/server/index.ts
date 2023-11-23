// ! Base
export type BaseApiResponse = {
  success: boolean;
};
type SuccessAndOptionalReason = BaseApiResponse & {
  reason?: string;
  detail?: string;
};
type AuthToken = { token: string };

// ! Auth
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

// ! USER
export type DeactivateApiAuthToken = AuthToken;
export type DeactivateApiResponse = { success?: boolean; detail?: string };
export type GetUserInfoApiAuthToken = AuthToken;
export type GetUserInfoApiResponse = {
  success?: boolean;
  user_id?: number;
  email?: string;
  name?: string;
  profile_image_link?: string | null;
  profile_image_updated_at?: string | null;
  provider?: 'our' | 'naver' | 'kakao';
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
  profile_image_updated_at?: string | null;
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
    description_resource_links?: string;
  };
};
export type ModifyUserDetailInfoApiResponse = SuccessAndOptionalReason;
type SearchUser = {
  id: number;
  email: string;
  profile_image_link: string | null;
  profile_image_updated_at: string | null;
};
export type SearchApiParams = {
  email: string;
};
export type SearchApiResponse = SuccessAndOptionalReason & {
  result?: SearchUser[];
};
export type GetProjectInviteForInviterApiAuthToken = AuthToken;
export type GetProjectInviteForInviterApiResponse = SuccessAndOptionalReason & {
  result?: {
    project_id: number;
    invitee_email: string;
  }[];
};
export type GetProjectInviterForInviteeApiAuthToken = AuthToken;
export type GetProjectInviterForInviteeApiResponse =
  SuccessAndOptionalReason & {
    result?: {
      project_id: number;
      inviter_email: string;
      created_at: string;
    }[];
  };
export type ReplyProjectInviteApiAuthToken = AuthToken & {
  body: {
    project_id: number;
    inviter_email: string;
    accept: boolean;
  };
};
export type ReplyProjectInviteApiResponse = SuccessAndOptionalReason;

// ! ExternalHistory
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
export type GithubUpdateStatusApiAuthToken = {
  user_id: string;
};
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

// ! RESOURCE
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
  type: 'profile' | 'resource';
};
export type GetPreSignedURLApiResponse = {
  success?: boolean;
  detail?: string;
  reason?: string;
  url?: string;
  aws_response?: AWSResponse;
};

// ! PROJECT
type TaskGroupStatus = 'READY_PROGRESSING' | 'COMPLETED';
type MilestoneStatus = 'IN_PROGRESS' | 'COMPLETED';
type ProjectStatus = 'READY' | 'IN_PROGRESS' | 'COMPLETED' | 'TERMINATED';
type TaskPermission = 'OWNER' | 'MANAGER' | 'MEMBER' | 'NOTHING';
type TaskGroupPermission = 'OWNER' | 'MANAGER' | 'MEMBER' | 'NOTHING';
type MilestonePermission = 'OWNER' | 'MANAGER' | 'MEMBER' | 'NOTHING';
type ProjectPermission = 'OWNER' | 'MANAGER' | 'MEMBER' | 'NOTHING';
type Member = {
  id: number;
  name: string;
  email: string;
  profile_image_link: string | null;
  profile_image_updated_at: string | null;
};
type Task = {
  id: number;
  project?: { id: number; title: string; thumbnail_image: string };
  milestone?: { id: number; subject: string };
  task_group?: { id: number; title: string };
  owner?: {
    id: number;
    name: string;
  };
  title: string;
  description?: string;
  description_resource_links?: string[] | string;
  created_at?: string;
  tags?: string[];
  members?: Member[];
  is_public?: boolean;
  permission?: TaskPermission;
};
type TaskGroup = {
  id: number;
  project?: { id: number; title: string; thumbnail_image: string };
  milestone?: { id: number; subject: string };
  tasks?: Task[];
  created_by?: {
    id: number;
    name: string;
  };
  status?: TaskGroupStatus;
  title: string;
  created_at?: string;
  due_date?: string;
  permission?: TaskGroupPermission;
};
type Milestone = {
  id: number;
  project?: { id: number; title: string; thumbnail_image: string };
  created_by?: {
    id: number;
    name: string;
  };
  status?: MilestoneStatus;
  subject: string;
  tags?: string[];
  created_at?: string;
  due_date?: string;
  task_groups?: TaskGroup[];
  permission?: MilestonePermission;
};
type Project = {
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
  milestones?: Milestone[];
};
export type CreateProjectApiAuthTokenAndBody = AuthToken & {
  body: {
    title: string;
    short_description?: string;
    description?: string;
    description_resource_links?: string;
    due_date?: string;
    thumbnail_image?: string;
  };
};
export type CreateProjectApiResponse = SuccessAndOptionalReason & {
  created_at?: string;
  project_id?: number;
  status?: ProjectStatus;
  title: string;
  short_description?: string;
  description?: string;
  description_resource_links?: string;
  due_date?: string;
  thumbnail_image?: string;
};
export type GetProjectInfoApiPartialAuthTokenAndBody = Partial<AuthToken> & {
  project_id: string;
};
export type GetProjectInfoApiResponse = SuccessAndOptionalReason & Project;
export type GetAllProjectInfoApiResponse = SuccessAndOptionalReason & {
  count?: number;
  projects?: Project[];
};
export type MakeInviteApiAuthTokenAndBody = AuthToken & {
  body: {
    project_id: string;
    invitee_emails: string[];
  };
};
export type MakeInviteApiResponse = SuccessAndOptionalReason & {
  result?: {
    invitee_email: string;
    success: boolean;
    reason: string | null;
  }[];
};
export type ModifyProjectAuthApiTokenAndBody = AuthToken & {
  project_id: string;
  body: Partial<Project>;
};
export type ModifyProjectAuthApiResponse = SuccessAndOptionalReason;

// ! MILESTONE
export type CreateMileStoneAuthApiTokenAndBody = AuthToken & {
  project_id: string;
  body: Project;
};
export type CreateMilestoneAuthApiResponse = SuccessAndOptionalReason;
export type ModifyMileStoneAuthApiTokenAndBody = AuthToken & {
  milestone_id: string;
  body: Partial<Project>;
};
export type ModifyMilestoneAuthApiResponse = SuccessAndOptionalReason;
export type GetMileStoneAuthApiTokenAndBody = Partial<AuthToken> & {
  milestone_id: string;
};
export type GetMilestoneAuthApiResponse = SuccessAndOptionalReason & Milestone;

// ! TASK GROUP
export type CreateTaskGroupAuthApiTokenAndBody = AuthToken & {
  milestone_id: string;
  body: Project;
};
export type CreateTaskGroupAuthApiResponse = SuccessAndOptionalReason;
export type ModifyTaskGroupAuthApiTokenAndBody = AuthToken & {
  task_group_id: string;
  body: Partial<Project>;
};
export type ModifyTaskGroupAuthApiResponse = SuccessAndOptionalReason;
export type GetTaskGroupAuthApiTokenAndBody = Partial<AuthToken> & {
  task_group_id: string;
};
export type GetTaskGroupAuthApiResponse = SuccessAndOptionalReason & TaskGroup;

// ! TASK
export type CreateTaskAuthApiTokenAndBody = AuthToken & {
  task_group_id: string;
  body: Project;
};
export type CreateTaskAuthApiResponse = SuccessAndOptionalReason & {
  task_id?: number;
};
export type ModifyTaskAuthApiTokenAndBody = AuthToken & {
  task_id: string;
  body: Partial<Project>;
};
export type ModifyTaskAuthApiResponse = SuccessAndOptionalReason;
export type GetTaskAuthApiTokenAndBody = Partial<AuthToken> & {
  task_id: string;
};
export type GetTaskAuthApiResponse = SuccessAndOptionalReason & Task;
