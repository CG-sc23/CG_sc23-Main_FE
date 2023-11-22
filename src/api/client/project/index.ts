import { handleClientError } from '@/api/handleError';
import { client as http } from '@/api/instance';
import {
  CreateProjectAuthTokenAndBody,
  CreateProjectResponse,
  GetAllProjectInfoResponse,
  GetProjectInfoPartialAuthTokenAndBody,
  GetProjectInfoResponse,
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
};
