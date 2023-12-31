import { handleApiError } from '@/api/handleError';
import { server as http } from '@/api/instance';
import {
  CreateProjectApiAuthTokenAndBody,
  CreateProjectApiResponse,
  GetAllProjectInfoApiResponse,
  GetProjectInfoApiPartialAuthTokenAndBody,
  GetProjectInfoApiResponse,
  MakeInviteApiAuthTokenAndBody,
  MakeInviteApiResponse,
  ModifyProjectAuthApiTokenAndBody,
  ModifyProjectAuthApiResponse,
  CreateMileStoneAuthApiTokenAndBody,
  CreateMilestoneAuthApiResponse,
  ModifyMileStoneAuthApiTokenAndBody,
  ModifyMilestoneAuthApiResponse,
  GetMileStoneAuthApiTokenAndBody,
  GetMilestoneAuthApiResponse,
  DeleteMileStoneApiAuthTokenAndQuery,
  DeleteMileStoneApiResponse,
  CreateTaskGroupAuthApiTokenAndBody,
  CreateTaskGroupAuthApiResponse,
  ModifyTaskGroupAuthApiTokenAndBody,
  ModifyTaskGroupAuthApiResponse,
  GetTaskGroupAuthApiTokenAndBody,
  GetTaskGroupAuthApiResponse,
  DeleteTaskGroupApiAuthTokenAndQuery,
  DeleteTaskGroupApiResponse,
  CreateTaskAuthApiTokenAndBody,
  CreateTaskAuthApiResponse,
  ModifyTaskAuthApiTokenAndBody,
  ModifyTaskAuthApiResponse,
  GetTaskAuthApiTokenAndBody,
  GetTaskAuthApiResponse,
  DeleteTaskApiAuthTokenAndQuery,
  DeleteTaskApiResponse,
  MakeJoinRequestApiAuthTokenAndPayload,
  MakeJoinRequestApiResponse,
  ReplyJoinRequestApiAuthTokenAndPayload,
  ReplyJoinRequestApiResponse,
  ViewJoinRequestApiAuthTokeAndQueries,
  ViewJoinRequestApiResponse,
  KickMemberApiAuthTokenAndPayload,
  KickMemberApiResponse,
  GetPaginatedTaskListsQuery,
  GetPaginateTaskListApiResponse,
  MakeMilestoneGPTApiAuthTokenAndQueries,
  MakeMilestoneGPTApiResponse,
  RecommendProjectAuthToken,
  RecommendProjectApiResponse,
} from '@/libs/type/server';

export const Projects = {
  async postCreateProject(payload: CreateProjectApiAuthTokenAndBody) {
    try {
      return await http.post<CreateProjectApiResponse>(
        `/project/v1`,
        payload.body,
        {
          headers: {
            Authorization: `Token ${payload.token}`,
          },
        },
      );
    } catch (e) {
      return handleApiError<CreateProjectApiResponse>(e);
    }
  },
  async getAllProjectInfo() {
    try {
      return await http.get<GetAllProjectInfoApiResponse>(
        `/project/v1/info/all`,
      );
    } catch (e) {
      return handleApiError<GetAllProjectInfoApiResponse>(e);
    }
  },
  async getProjectInfo(params: GetProjectInfoApiPartialAuthTokenAndBody) {
    try {
      return await http.get<GetProjectInfoApiResponse>(
        `/project/v1/info/${params.project_id}`,
        {
          headers: {
            Authorization: params.token ? `Token ${params.token}` : null,
          },
        },
      );
    } catch (e) {
      return handleApiError<GetProjectInfoApiResponse>(e);
    }
  },
  async postMakeInvite(payload: MakeInviteApiAuthTokenAndBody) {
    try {
      return await http.post<MakeInviteApiResponse>(
        `/project/v1/invite`,
        payload.body,
        {
          headers: {
            Authorization: `Token ${payload.token}`,
          },
        },
      );
    } catch (e) {
      return handleApiError<MakeInviteApiResponse>(e);
    }
  },
  async putModifyProject(payload: ModifyProjectAuthApiTokenAndBody) {
    try {
      return await http.put<ModifyProjectAuthApiResponse>(
        `/project/v1/${payload.project_id}`,
        payload.body,
        {
          headers: {
            Authorization: `Token ${payload.token}`,
          },
        },
      );
    } catch (e) {
      return handleApiError<ModifyProjectAuthApiResponse>(e);
    }
  },
  async postMakeJoinRequest(payload: MakeJoinRequestApiAuthTokenAndPayload) {
    try {
      return await http.post<MakeJoinRequestApiResponse>(
        `/project/v1/${payload.project_id}/join`,
        payload.body,
        {
          headers: {
            Authorization: `Token ${payload.token}`,
          },
        },
      );
    } catch (e) {
      return handleApiError<MakeJoinRequestApiResponse>(e);
    }
  },
  async postReplyJoinRequest(payload: ReplyJoinRequestApiAuthTokenAndPayload) {
    try {
      return await http.post<ReplyJoinRequestApiResponse>(
        `/project/v1/join/reply`,
        payload.body,
        {
          headers: {
            Authorization: `Token ${payload.token}`,
          },
        },
      );
    } catch (e) {
      return handleApiError<ReplyJoinRequestApiResponse>(e);
    }
  },
  async getViewJoinRequest(params: ViewJoinRequestApiAuthTokeAndQueries) {
    try {
      return await http.get<ViewJoinRequestApiResponse>(
        `/project/v1/${params.project_id}/join`,
        {
          headers: {
            Authorization: `Token ${params.token}`,
          },
        },
      );
    } catch (e) {
      return handleApiError<ViewJoinRequestApiResponse>(e);
    }
  },
  async deleteKickMember(payload: KickMemberApiAuthTokenAndPayload) {
    try {
      return await http.delete<KickMemberApiResponse>(
        `/project/v1/${payload.project_id}/kick?user_email=${payload.user_email}`,
        {
          headers: {
            Authorization: `Token ${payload.token}`,
          },
        },
      );
    } catch (e) {
      return handleApiError<KickMemberApiResponse>(e);
    }
  },
  async getMakeMilestoneGPT(params: MakeMilestoneGPTApiAuthTokenAndQueries) {
    try {
      return await http.get<MakeMilestoneGPTApiResponse>(
        `/project/v1/${params.project_id}/milestone-gpt`,
        {
          headers: {
            Authorization: `Token ${params.token}`,
          },
        },
      );
    } catch (e) {
      return handleApiError<MakeMilestoneGPTApiResponse>(e);
    }
  },
};

export const MileStone = {
  async postCreateMileStone(payload: CreateMileStoneAuthApiTokenAndBody) {
    try {
      return await http.post<CreateMilestoneAuthApiResponse>(
        `/milestone/v1/${payload.project_id}`,
        payload.body,
        {
          headers: {
            Authorization: `Token ${payload.token}`,
          },
        },
      );
    } catch (e) {
      return handleApiError<CreateMilestoneAuthApiResponse>(e);
    }
  },
  async putModifyMilestone(payload: ModifyMileStoneAuthApiTokenAndBody) {
    try {
      return await http.put<ModifyMilestoneAuthApiResponse>(
        `/milestone/v1/${payload.milestone_id}`,
        payload.body,
        {
          headers: {
            Authorization: `Token ${payload.token}`,
          },
        },
      );
    } catch (e) {
      return handleApiError<ModifyMilestoneAuthApiResponse>(e);
    }
  },
  async getMilestoneInfo(params: GetMileStoneAuthApiTokenAndBody) {
    try {
      return await http.get<GetMilestoneAuthApiResponse>(
        `/milestone/v1/${params.milestone_id}`,
        {
          headers: {
            Authorization: params.token ? `Token ${params.token}` : null,
          },
        },
      );
    } catch (e) {
      return handleApiError<GetMilestoneAuthApiResponse>(e);
    }
  },
  async deleteMilestoneInfo(params: DeleteMileStoneApiAuthTokenAndQuery) {
    try {
      return await http.delete<DeleteMileStoneApiResponse>(
        `/milestone/v1/${params.milestone_id}`,
        {
          headers: {
            Authorization: params.token ? `Token ${params.token}` : null,
          },
        },
      );
    } catch (e) {
      return handleApiError<DeleteMileStoneApiResponse>(e);
    }
  },
};

export const TaskGroup = {
  async postCreateTaskGroup(payload: CreateTaskGroupAuthApiTokenAndBody) {
    console.log(payload);
    try {
      return await http.post<CreateTaskGroupAuthApiResponse>(
        `/task-group/v1/${payload.milestone_id}`,
        payload.body,
        {
          headers: {
            Authorization: `Token ${payload.token}`,
          },
        },
      );
    } catch (e) {
      return handleApiError<CreateTaskGroupAuthApiResponse>(e);
    }
  },
  async putModifyTaskGroup(payload: ModifyTaskGroupAuthApiTokenAndBody) {
    try {
      return await http.put<ModifyTaskGroupAuthApiResponse>(
        `/task-group/v1/${payload.task_group_id}`,
        payload.body,
        {
          headers: {
            Authorization: `Token ${payload.token}`,
          },
        },
      );
    } catch (e) {
      return handleApiError<ModifyTaskGroupAuthApiResponse>(e);
    }
  },
  async getTaskGroupInfo(params: GetTaskGroupAuthApiTokenAndBody) {
    try {
      return await http.get<GetTaskGroupAuthApiResponse>(
        `/task-group/v1/${params.task_group_id}`,
        {
          headers: {
            Authorization: params.token ? `Token ${params.token}` : null,
          },
        },
      );
    } catch (e) {
      return handleApiError<GetTaskGroupAuthApiResponse>(e);
    }
  },
  async deleteTaskGroupInfo(params: DeleteTaskGroupApiAuthTokenAndQuery) {
    try {
      return await http.delete<DeleteTaskGroupApiResponse>(
        `/task-group/v1/${params.task_group_id}`,
        {
          headers: {
            Authorization: `Token ${params.token}`,
          },
        },
      );
    } catch (e) {
      return handleApiError<DeleteTaskGroupApiResponse>(e);
    }
  },
};

export const Task = {
  async postCreateTask(payload: CreateTaskAuthApiTokenAndBody) {
    try {
      return await http.post<CreateTaskAuthApiResponse>(
        `/task/v1/${payload.task_group_id}`,
        payload.body,
        {
          headers: {
            Authorization: `Token ${payload.token}`,
          },
        },
      );
    } catch (e) {
      return handleApiError<CreateTaskAuthApiResponse>(e);
    }
  },
  async putModifyTask(payload: ModifyTaskAuthApiTokenAndBody) {
    try {
      return await http.put<ModifyTaskAuthApiResponse>(
        `/task/v1/${payload.task_id}`,
        payload.body,
        {
          headers: {
            Authorization: `Token ${payload.token}`,
          },
        },
      );
    } catch (e) {
      return handleApiError<ModifyTaskAuthApiResponse>(e);
    }
  },
  async getTaskInfo(params: GetTaskAuthApiTokenAndBody) {
    try {
      return await http.get<GetTaskAuthApiResponse>(
        `/task/v1/${params.task_id}`,
        {
          headers: {
            Authorization: params.token ? `Token ${params.token}` : null,
          },
        },
      );
    } catch (e) {
      return handleApiError<GetTaskAuthApiResponse>(e);
    }
  },
  async deleteTaskInfo(params: DeleteTaskApiAuthTokenAndQuery) {
    try {
      return await http.delete<DeleteTaskApiResponse>(
        `/task/v1/${params.task_id}`,
        {
          headers: {
            Authorization: `Token ${params.token}`,
          },
        },
      );
    } catch (e) {
      return handleApiError<DeleteTaskApiResponse>(e);
    }
  },
  async getPaginatedTaskLists(query: GetPaginatedTaskListsQuery) {
    try {
      return await http.get<GetPaginateTaskListApiResponse>(
        `/task/v1/page/${query.page_id}`,
      );
    } catch (e) {
      return handleApiError<GetPaginateTaskListApiResponse>(e);
    }
  },
  async getRecommendedProject(query: RecommendProjectAuthToken) {
    try {
      return await http.get<RecommendProjectApiResponse>(
        `/project/v1/recommend`,
        {
          headers: {
            Authorization: query?.token ? `Token ${query.token}` : null,
          },
        },
      );
    } catch (e) {
      return handleApiError<RecommendProjectApiResponse>(e);
    }
  },
};
