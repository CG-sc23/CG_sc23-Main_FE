import { handleApiError } from '@/api/handleError';
import { server as http } from '@/api/instance';
import {
  CreateProjectApiAuthTokenAndBody,
  CreateProjectApiResponse,
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
};