import { client as http } from '@/api/instance';

import { handleClientError } from '@/api/handleError';
import {
  DeactivateAuthToken,
  DeactivateResponse,
  GetUserInfoResponse,
  GetUserInfoAuthToken,
  UserDetailInfoQuery,
  UserDetailInfoResponse,
  ModifyUserDetailInfoAuthTokenAndBody,
  ModifyUserDetailInfoResponse,
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
  async userDetail(query: UserDetailInfoQuery) {
    try {
      const { data } = await http.get<UserDetailInfoResponse>(
        `http://localhost:3000/api/user/detail/${query.user_id}`,
      );

      return data;
    } catch (e) {
      return handleClientError<UserDetailInfoResponse>(e);
    }
  },
  async modifyUserInfo(payload: ModifyUserDetailInfoAuthTokenAndBody) {
    try {
      const { data } = await http.put<ModifyUserDetailInfoResponse>(
        '/api/user/modify',
        payload.body,
        {
          headers: {
            Authorization: `Token ${payload.token}`,
          },
        },
      );

      return data;
    } catch (e) {
      return handleClientError<ModifyUserDetailInfoResponse>(e);
    }
  },
};
