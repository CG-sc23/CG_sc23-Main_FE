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
  provider?: 'our' | 'naver' | 'kakao';
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
  provider?: 'our' | 'naver' | 'kakao';
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
export type SearchUser = {
  id: number;
  email: string;
  name: string;
  profile_image_link: string;
  profile_image_updated_at: string | null;
  short_description: string | null;
};
export type SearchParams = {
  request_data: string;
};
export type SearchResponse = OkAndOptionalReason & {
  result?: SearchUser[];
};
export type RecommendedUser = {
  id: number;
  email: string;
  name: string;
  profile_image_link: string;
  profile_image_updated_at: string | null;
  short_description: string | null;
};
export type RecommendedUserParams = Partial<AuthToken>;
export type RecommendedUserResponse = OkAndOptionalReason & {
  users?: RecommendedUser[];
};
export type GetProjectInviteForInviterAuthToken = AuthToken;
export type GetProjectInviteForInviterResponse = OkAndOptionalReason & {
  result?: {
    project_id: number;
    invitee_email: string;
  }[];
};
export type GetProjectInviteForInviteeAuthToken = AuthToken;
export type GetProjectInviteForInviteeResponse = OkAndOptionalReason & {
  result?: {
    project_id: number;
    inviter_email: string;
    created_at: string;
  }[];
};
export type ReplyProjectInviteAuthToken = AuthToken & {
  body: {
    project_id: number;
    inviter_email: string;
    accept: boolean;
  };
};
export type ReplyProjectInviteResponse = OkAndOptionalReason;
export type GetProjectsInfoAuthToken = { user_id: string };
export type GetProjectsInfoResponse = OkAndOptionalReason & {
  projects?: ProjectInfo[];
};
export type GetTasksInfoQuery = Partial<AuthToken> & {
  user_id: string;
};
export type GetTasksInfoResponse = OkAndOptionalReason & {
  tasks?: Task[];
};

// ! ExternalHistory
export type CommonStackQuery = { stack: string };
export type CommonStackResponse = OkAndOptionalReason & {
  url?: string;
};
export type GitHubAccountCheckQuery = {
  github_link: string;
};
export type GitHubAccountCheckResponse = OkAndOptionalReason;
type GITHUB_STATUS = 'IN_PROGRESS' | 'COMPLETE' | 'FAIL';
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
export type ProjectInfo = {
  project: {
    id: number;
    owner: Member;
    status: ProjectStatus;
    title: string;
    short_description: string;
    description: string;
    description_resource_links: string;
    created_at: string;
    due_date: string;
    thumbnail_image: string;
    members: Member[];
  };
};

// ! RESOURCE
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
  type: 'resource' | 'profile';
} & AuthToken;
export type GetPreSignedURLResponse = OkAndOptionalReason & {
  url?: string;
  aws_response?: AWSResponse;
};

// ! PROJECT
export type TaskGroupStatus = 'READY' | 'IN_PROGRESS' | 'COMPLETED';
export type MilestoneStatus = 'IN_PROGRESS' | 'COMPLETED';
export type ProjectStatus =
  | 'READY'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'TERMINATED';
export type TaskPermission = 'OWNER' | 'MANAGER' | 'MEMBER' | 'NOTHING';
export type TaskGroupPermission = 'OWNER' | 'MANAGER' | 'MEMBER' | 'NOTHING';
export type MilestonePermission = 'OWNER' | 'MANAGER' | 'MEMBER' | 'NOTHING';
export type ProjectPermission = 'OWNER' | 'MANAGER' | 'MEMBER' | 'NOTHING';
export type Member = {
  id: number;
  name: string;
  email: string;
  profile_image_link: string | null;
  profile_image_updated_at: string | null;
};
export type Task = {
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
  tags?: string[] | string;
  members?: Member[];
  is_public?: boolean;
  permission?: TaskPermission;
};
export type TaskGroup = {
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
export type Milestone = {
  id: number;
  project?: { id: number; title: string; thumbnail_image: string };
  created_by?: {
    id: number;
    name: string;
  };
  status?: MilestoneStatus;
  subject: string;
  tags?: string[] | string;
  created_at?: string;
  due_date?: string;
  task_groups?: TaskGroup[];
  permission?: MilestonePermission;
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
  id?: number;
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
export type MakeInviteAuthTokenAndBody = AuthToken & {
  body: {
    project_id: number;
    invitee_emails: string;
  };
};
export type MakeInviteResponse = OkAndOptionalReason & {
  result?: {
    invitee_email: string;
    success: boolean;
    reason: string | null;
  }[];
};
export type ModifyProjectAuthTokenAndBody = AuthToken & {
  body: Partial<Project>;
  project_id: number;
};
export type ModifyProjectAuthResponse = OkAndOptionalReason & Partial<Project>;
export type MakeJoinRequestAuthTokenAndPayload = AuthToken & {
  project_id: number;
  body: {
    message: string;
  };
};
export type MakeJoinRequestResponse = OkAndOptionalReason;
export type ReplyJoinRequestAuthTokenAndPayload = AuthToken & {
  body: {
    join_request_id: number;
    accept: boolean;
  };
};
export type ReplyJoinRequestResponse = OkAndOptionalReason;
export type ViewJoinRequestAuthTokeAndQueries = AuthToken & {
  project_id: number;
};
export type ViewJoinRequestResponse = OkAndOptionalReason & {
  result?: {
    id: string;
    user: Member;
    message: string;
    created_at: string;
  }[];
};
export type KickMemberAuthTokenAndPayload = AuthToken & {
  project_id: number;
  user_email: string;
};
export type KickMemberResponse = OkAndOptionalReason;
export type MakeMilestoneGPTAuthTokenAndQueries = AuthToken & {
  project_id: number;
};
export type MakeMilestoneGPTResponse = OkAndOptionalReason & {
  title?: string;
  tags?: string[];
};
export type RecommendProjectQuery = Partial<AuthToken>;
export type RecommendProjectResponse = OkAndOptionalReason & {
  projects?: Project[];
};

// ! MILESTONE
export type CreateMileStoneAuthTokenAndBody = AuthToken & {
  project_id: string;
  body: Partial<Milestone>;
};
export type CreateMilestoneAuthResponse = OkAndOptionalReason;
export type ModifyMileStoneAuthTokenAndBody = AuthToken & {
  milestone_id: string;
  body: Partial<Milestone>;
};
export type ModifyMilestoneAuthResponse = OkAndOptionalReason;
export type GetMileStoneAuthTokenAndBody = Partial<AuthToken> & {
  milestone_id: string;
};
export type GetMilestoneAuthResponse = OkAndOptionalReason & Partial<Milestone>;
export type DeleteMileStoneAuthTokenAndQuery = AuthToken & {
  milestone_id: string;
};
export type DeleteMileStoneResponse = OkAndOptionalReason;

// ! TASK GROUP
export type CreateTaskGroupAuthTokenAndBody = AuthToken & {
  milestone_id: string;
  body: Partial<TaskGroup>;
};
export type CreateTaskGroupAuthResponse = OkAndOptionalReason;
export type ModifyTaskGroupAuthTokenAndBody = AuthToken & {
  task_group_id: string;
  body: Partial<TaskGroup>;
};
export type ModifyTaskGroupAuthResponse = OkAndOptionalReason;
export type GetTaskGroupAuthTokenAndBody = Partial<AuthToken> & {
  task_group_id: string;
};
export type GetTaskGroupAuthResponse = OkAndOptionalReason & Partial<TaskGroup>;
export type DeleteTaskGroupAuthTokenAndQuery = AuthToken & {
  task_group_id: string;
};
export type DeleteTaskGroupResponse = OkAndOptionalReason;

// ! TASK
export type CreateTaskAuthTokenAndBody = AuthToken & {
  task_group_id: string;
  body: Partial<Task>;
};
export type CreateTaskAuthResponse = OkAndOptionalReason & { id?: number };
export type ModifyTaskAuthTokenAndBody = AuthToken & {
  task_id: string;
  body: Partial<Task>;
};
export type ModifyTaskAuthResponse = OkAndOptionalReason;
export type GetTaskAuthTokenAndBody = Partial<AuthToken> & {
  task_id: string;
};
export type GetTaskAuthResponse = OkAndOptionalReason & Partial<Task>;
export type DeleteTaskAuthTokenAndQuery = AuthToken & {
  task_id: string;
};
export type DeleteTaskResponse = OkAndOptionalReason;
export type PaginatedTask = {
  id: number;
  project: {
    id: number;
    title: string;
  };
  milestone: {
    id: number;
    subject: string;
  };
  task_group: {
    id: number;
    title: string;
  };
  owner: Member;
  title: string;
  description: string;
  description_resource_links: string;
  created_at: string;
  tags: string[];
};
export type PaginatedTaskListsQuery = {
  page_id: string;
};
export type PaginateTaskListsResponse = OkAndOptionalReason & {
  tasks?: PaginatedTask[];
};

// ! Advertise
export type Advertise = {
  site_link: string;
  file_link: string;
};
export type AdvertiseResponse = OkAndOptionalReason & {
  advertise?: Advertise;
};

// ! Report
export type CreateReportAuthTokenAndPayload = AuthToken & {
  body: {
    title: string;
    description: string;
  };
  task_id: number;
};
export type CreateReportResponse = OkAndOptionalReason;
