import { handleApiError } from '@/api/handleError';
import { server as http } from '@/api/instance';
import {
  DeactivateApiAuthToken,
  DeactivateApiResponse,
  GetUserInfoApiAuthToken,
  GetUserInfoApiResponse,
} from '@/libs/type/server';

export const Deactivate = {
  async deleteDeactivate(queries: DeactivateApiAuthToken) {
    try {
      return await http.delete<DeactivateApiResponse>(`/user/v1`, {
        headers: {
          Authorization: `Token ${queries.token}`,
        },
      });
    } catch (e) {
      return handleApiError<DeactivateApiResponse>(e);
    }
  },
};

export const UserInfo = {
  async getUserInfo(queries: GetUserInfoApiAuthToken) {
    try {
      return await http.get<GetUserInfoApiResponse>(`/user/v1`, {
        headers: {
          Authorization: `Token ${queries.token}`,
        },
      });
    } catch (e) {
      return handleApiError<GetUserInfoApiResponse>(e);
    }
  },
};
