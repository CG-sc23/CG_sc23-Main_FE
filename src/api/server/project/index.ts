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
};
