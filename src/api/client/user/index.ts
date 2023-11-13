import { client as http } from '@/api/instance';

import { handleClientError } from '@/api/handleError';
import {
  DeactivateAuthToken,
  DeactivateResponse,
  GetUserInfoResponse,
  GetUserInfoAuthToken,
} from '@/libs/type/client';

export const Deactivate = {
  async deactivate(queries: DeactivateAuthToken) {
    try {
      const { data } = await http.delete<DeactivateResponse>(
        '/api/user/deactivate',
        {
          headers: {
            Authorization: `Token ${queries.token}`,
          },
        },
      );

      return data;
    } catch (e) {
      return handleClientError<DeactivateResponse>(e);
    }
  },
};

export const UserInfo = {
  async userInfo(queries: GetUserInfoAuthToken) {
    try {
      const { data } = await http.get<GetUserInfoResponse>('/api/user/info', {
        headers: {
          Authorization: `Token ${queries.token}`,
        },
      });

      return data;
    } catch (e) {
      return handleClientError<GetUserInfoResponse>(e);
    }
  },
};
