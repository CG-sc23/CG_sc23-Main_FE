import { handleClientError } from '@/api/handleError';
import { client as http } from '@/api/instance';
import {
  CreateProjectAuthTokenAndBody,
  CreateProjectResponse,
  GetAllProjectInfoResponse,
  GetProjectInfoPartialAuthTokenAndBody,
  GetProjectInfoResponse,
  MakeInviteAuthTokenAndBody,
  MakeInviteResponse,
  ModifyProjectAuthTokenAndBody,
  ModifyProjectAuthResponse,
  CreateMileStoneAuthTokenAndBody,
  CreateMilestoneAuthResponse,
  CreateTaskAuthResponse,
  CreateTaskAuthTokenAndBody,
  CreateTaskGroupAuthResponse,
  CreateTaskGroupAuthTokenAndBody,
  ModifyMileStoneAuthTokenAndBody,
  ModifyMilestoneAuthResponse,
  ModifyTaskAuthResponse,
  ModifyTaskAuthTokenAndBody,
  ModifyTaskGroupAuthResponse,
  ModifyTaskGroupAuthTokenAndBody,
  GetMileStoneAuthTokenAndBody,
  GetMilestoneAuthResponse,
  GetTaskAuthResponse,
  GetTaskAuthTokenAndBody,
  GetTaskGroupAuthResponse,
  GetTaskGroupAuthTokenAndBody,
  MakeJoinRequestAuthTokenAndPayload,
  MakeJoinRequestResponse,
  ReplyJoinRequestAuthTokenAndPayload,
  ReplyJoinRequestResponse,
  ViewJoinRequestAuthTokeAndQueries,
  ViewJoinRequestResponse,
  KickMemberAuthTokenAndPayload,
  KickMemberResponse,
  PaginatedTaskListsQuery,
  PaginateTaskListsResponse,
  MakeMilestoneGPTAuthTokenAndQueries,
  MakeMilestoneGPTResponse,
  RecommendProjectQuery,
  RecommendProjectResponse,
} from '@/libs/type/client';

export const Projects = {
  async createProject(payload: CreateProjectAuthTokenAndBody) {
    try {
      const { data } = await http.post<CreateProjectResponse>(
        `/api/project/create`,
        payload.body,
        {
          headers: {
            Authorization: `Token ${payload.token}`,
          },
        },
      );

      return data;
    } catch (e) {
      return handleClientError<CreateProjectResponse>(e);
    }
  },
  async allProjectInfo() {
    try {
      const { data } = await http.get<GetAllProjectInfoResponse>(
        `/api/project/info/all`,
      );

      return data;
    } catch (e) {
      return handleClientError<GetAllProjectInfoResponse>(e);
    }
  },
  async projectInfo(params: GetProjectInfoPartialAuthTokenAndBody) {
    try {
      const { data } = await http.get<GetProjectInfoResponse>(
        `/api/project/info/${params.project_id}`,
        {
          headers: {
            Authorization: `Token ${params.token ?? ''}`,
          },
        },
      );

      return data;
    } catch (e) {
      return handleClientError<GetProjectInfoResponse>(e);
    }
  },
  async makeInvite(payload: MakeInviteAuthTokenAndBody) {
    try {
      const { data } = await http.post<MakeInviteResponse>(
        `/api/project/invite`,
        payload.body,
        {
          headers: {
            Authorization: `Token ${payload.token}`,
          },
        },
      );

      return data;
    } catch (e) {
      return handleClientError<MakeInviteResponse>(e);
    }
  },
  async modifyProject(payload: ModifyProjectAuthTokenAndBody) {
    try {
      const { data } = await http.put<ModifyProjectAuthResponse>(
        `/api/project/${payload.project_id}`,
        payload.body,
        {
          headers: {
            Authorization: `Token ${payload.token}`,
          },
        },
      );

      return data;
    } catch (e) {
      return handleClientError<ModifyProjectAuthResponse>(e);
    }
  },
  async makeJoinRequest(payload: MakeJoinRequestAuthTokenAndPayload) {
    try {
      const { data } = await http.post<MakeJoinRequestResponse>(
        `/api/project/join/${payload.project_id}`,
        payload.body,
        {
          headers: {
            Authorization: `Token ${payload.token}`,
          },
        },
      );
      return data;
    } catch (e) {
      return handleClientError<MakeJoinRequestResponse>(e);
    }
  },
  async replyJoinRequest(payload: ReplyJoinRequestAuthTokenAndPayload) {
    try {
      const { data } = await http.post<ReplyJoinRequestResponse>(
        `/api/project/join/reply`,
        payload.body,
        {
          headers: {
            Authorization: `Token ${payload.token}`,
          },
        },
      );
      return data;
    } catch (e) {
      return handleClientError<ReplyJoinRequestResponse>(e);
    }
  },
  async viewJoinRequest(params: ViewJoinRequestAuthTokeAndQueries) {
    try {
      const { data } = await http.get<ViewJoinRequestResponse>(
        `/api/project/join/${params.project_id}`,
        {
          headers: {
            Authorization: `Token ${params.token}`,
          },
        },
      );
      return data;
    } catch (e) {
      return handleClientError<ViewJoinRequestResponse>(e);
    }
  },
  async kickMember(payload: KickMemberAuthTokenAndPayload) {
    try {
      const { data } = await http.delete<KickMemberResponse>(
        `/api/project/kick/${payload.project_id}?user_email=${payload.user_email}`,
        {
          headers: {
            Authorization: `Token ${payload.token}`,
          },
        },
      );

      return data;
    } catch (e) {
      return handleClientError<KickMemberResponse>(e);
    }
  },
  async makeMilestoneGPT(params: MakeMilestoneGPTAuthTokenAndQueries) {
    try {
      const { data } = await http.get<MakeMilestoneGPTResponse>(
        `/api/project/gpt/${params.project_id}`,
        {
          headers: {
            Authorization: `Token ${params.token}`,
          },
        },
      );

      return data;
    } catch (e) {
      return handleClientError<MakeMilestoneGPTResponse>(e);
    }
  },
  async recommendProject(query: RecommendProjectQuery) {
    try {
      const { data } = await http.get<RecommendProjectResponse>(
        '/api/project/recommendation',
        {
          headers: {
            Authorization: query?.token ? `Token ${query.token}` : null,
          },
        },
      );

      return data;
    } catch (e) {
      return handleClientError<RecommendProjectResponse>(e);
    }
  },
};

export const Milestone = {
  async createMileStone(payload: CreateMileStoneAuthTokenAndBody) {
    try {
      const { data } = await http.post<CreateMilestoneAuthResponse>(
        `/api/milestone/create/${payload.project_id}`,
        payload.body,
        {
          headers: {
            Authorization: `Token ${payload.token}`,
          },
        },
      );

      return data;
    } catch (e) {
      return handleClientError<CreateMilestoneAuthResponse>(e);
    }
  },
  async modifyMilestone(payload: ModifyMileStoneAuthTokenAndBody) {
    try {
      const { data } = await http.put<ModifyMilestoneAuthResponse>(
        `/api/milestone/modify/${payload.milestone_id}`,
        payload.body,
        {
          headers: {
            Authorization: `Token ${payload.token}`,
          },
        },
      );

      return data;
    } catch (e) {
      return handleClientError<ModifyMilestoneAuthResponse>(e);
    }
  },
  async milestoneInfo(params: GetMileStoneAuthTokenAndBody) {
    try {
      const { data } = await http.get<GetMilestoneAuthResponse>(
        `/api/milestone/info/${params.milestone_id}`,
        {
          headers: {
            Authorization: params.token ? `Token ${params.token}` : null,
          },
        },
      );

      return data;
    } catch (e) {
      return handleClientError<GetMilestoneAuthResponse>(e);
    }
  },
};

export const TaskGroup = {
  async createTaskGroup(payload: CreateTaskGroupAuthTokenAndBody) {
    try {
      const { data } = await http.post<CreateTaskGroupAuthResponse>(
        `/api/task-group/create/${payload.milestone_id}`,
        payload.body,
        {
          headers: {
            Authorization: `Token ${payload.token}`,
          },
        },
      );

      return data;
    } catch (e) {
      return handleClientError<CreateTaskGroupAuthResponse>(e);
    }
  },
  async modifyTaskGroup(payload: ModifyTaskGroupAuthTokenAndBody) {
    try {
      const { data } = await http.put<ModifyTaskGroupAuthResponse>(
        `/api/task-group/modify/${payload.task_group_id}`,
        payload.body,
        {
          headers: {
            Authorization: `Token ${payload.token}`,
          },
        },
      );

      return data;
    } catch (e) {
      return handleClientError<ModifyTaskGroupAuthResponse>(e);
    }
  },
  async TaskGroupInfo(params: GetTaskGroupAuthTokenAndBody) {
    try {
      const { data } = await http.get<GetTaskGroupAuthResponse>(
        `/api/task-group/info/${params.task_group_id}`,
        {
          headers: {
            Authorization: params.token ? `Token ${params.token}` : null,
          },
        },
      );

      return data;
    } catch (e) {
      return handleClientError<GetTaskGroupAuthResponse>(e);
    }
  },
};

export const Task = {
  async createTask(payload: CreateTaskAuthTokenAndBody) {
    try {
      const { data } = await http.post<CreateTaskAuthResponse>(
        `/api/task/create/${payload.task_group_id}`,
        payload.body,
        {
          headers: {
            Authorization: `Token ${payload.token}`,
          },
        },
      );

      return data;
    } catch (e) {
      return handleClientError<CreateTaskAuthResponse>(e);
    }
  },
  async modifyTask(payload: ModifyTaskAuthTokenAndBody) {
    try {
      const { data } = await http.put<ModifyTaskAuthResponse>(
        `/api/task/modify/${payload.task_id}`,
        payload.body,
        {
          headers: {
            Authorization: `Token ${payload.token}`,
          },
        },
      );

      return data;
    } catch (e) {
      return handleClientError<ModifyTaskAuthResponse>(e);
    }
  },
  async TaskInfo(params: GetTaskAuthTokenAndBody) {
    try {
      const { data } = await http.get<GetTaskAuthResponse>(
        `/api/task/info/${params.task_id}`,
        {
          headers: {
            Authorization: params.token ? `Token ${params.token}` : null,
          },
        },
      );

      return data;
    } catch (e) {
      return handleClientError<GetTaskAuthResponse>(e);
    }
  },
  async PaginatedTaskLists(params: PaginatedTaskListsQuery) {
    try {
      const { data } = await http.get<PaginateTaskListsResponse>(
        `/api/task/paginate/${params.page_id}`,
      );

      return data;
    } catch (e) {
      return handleClientError<PaginateTaskListsResponse>(e);
    }
  },
};
