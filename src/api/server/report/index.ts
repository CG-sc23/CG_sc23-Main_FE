import { server as http } from '@/api/instance';
import type {
  CreateReportApiAuthTokenAndPayload,
  CreateReportApiResponse,
} from '@/libs/type/server';
import { handleApiError } from '@/api/handleError';

export const Report = {
  async postCreateReport({
    token,
    body,
    task_id,
  }: CreateReportApiAuthTokenAndPayload) {
    try {
      return await http.post<CreateReportApiResponse>(
        `/report/v1/${task_id}`,
        body,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );
    } catch (e) {
      return handleApiError<CreateReportApiResponse>(e);
    }
  },
};
