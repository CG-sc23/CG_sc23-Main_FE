import { handleClientError } from '@/api/handleError';
import { client as http } from '@/api/instance';
import {
  CreateProjectAuthTokenAndBody,
  CreateProjectResponse,
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
};
