import { handleApiError } from '@/api/handleError';
import { server as http } from '@/api/instance';
import {
  CreateProjectApiAuthTokenAndBody,
  CreateProjectApiResponse,
  GetAllProjectInfoApiResponse,
  GetProjectInfoApiPartialAuthTokenAndBody,
  GetProjectInfoApiResponse,
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
            Authorization: `Token ${params.token ?? ''}`,
          },
        },
      );
    } catch (e) {
      return handleApiError<GetProjectInfoApiResponse>(e);
    }
  },
};
