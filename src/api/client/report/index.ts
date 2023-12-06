import { client as http } from '@/api/instance';
import type {
  CreateReportAuthTokenAndPayload,
  CreateReportResponse,
} from '@/libs/type/client';
import { handleClientError } from '@/api/handleError';

export const Report = {
  async createReport({
    token,
    body,
    task_id,
  }: CreateReportAuthTokenAndPayload) {
    try {
      const { data } = await http.post<CreateReportResponse>(
        `/api/task/report/${task_id}`,
        body,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );

      return data;
    } catch (e) {
      return handleClientError<CreateReportResponse>(e);
    }
  },
};
