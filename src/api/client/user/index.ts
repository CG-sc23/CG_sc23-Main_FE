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
  SearchParams,
  SearchResponse,
  RecommendedUserParams,
  RecommendedUserResponse,
  GetProjectInviteForInviterAuthToken,
  GetProjectInviteForInviterResponse,
  GetProjectInviteForInviteeAuthToken,
  GetProjectInviteForInviteeResponse,
  ReplyProjectInviteAuthToken,
  ReplyProjectInviteResponse,
  GetProjectsInfoAuthToken,
  GetProjectsInfoResponse,
  GetTasksInfoQuery,
  GetTasksInfoResponse,
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
  async userProjectsInfo(queries: GetProjectsInfoAuthToken) {
    try {
      const { data } = await http.get<GetProjectsInfoResponse>(
        `/api/user/projectsInfo/${queries.user_id}`,
      );

      return data;
    } catch (e) {
      return handleClientError<GetProjectsInfoResponse>(e);
    }
  },
  async userTasksInfo(query: GetTasksInfoQuery) {
    try {
      const { data } = await http.get<GetTasksInfoResponse>(
        `/api/user/tasksInfo/${query.user_id}`,
        {
          headers: {
            Authorization: query.token ? `Token ${query.token}` : null,
          },
        },
      );

      return data;
    } catch (e) {
      return handleClientError<GetTasksInfoResponse>(e);
    }
  },
  async userDetail(query: UserDetailInfoQuery) {
    try {
      const { data } = await http.get<UserDetailInfoResponse>(
        `/api/user/detail/${query.user_id}`,
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
  async searchUser(query: SearchParams) {
    try {
      const { data } = await http.get<SearchResponse>(
        `/api/user/search?request-data=${query.request_data}`,
      );

      return data;
    } catch (e) {
      return handleClientError<SearchResponse>(e);
    }
  },
  async recommendUser(query: RecommendedUserParams) {
    try {
      const { data } = await http.get<RecommendedUserResponse>(
        '/api/user/recommendation',
        {
          headers: {
            Authorization: query?.token ? `Token ${query.token}` : null,
          },
        },
      );

      return data;
    } catch (e) {
      return handleClientError<RecommendedUserResponse>(e);
    }
  },
  async projectInviter(queries: GetProjectInviteForInviterAuthToken) {
    try {
      const { data } = await http.get<GetProjectInviteForInviterResponse>(
        '/api/user/inviter',
        {
          headers: {
            Authorization: `Token ${queries.token}`,
          },
        },
      );

      return data;
    } catch (e) {
      return handleClientError<GetProjectInviteForInviterResponse>(e);
    }
  },
  async projectInvitee(queries: GetProjectInviteForInviteeAuthToken) {
    try {
      const { data } = await http.get<GetProjectInviteForInviteeResponse>(
        '/api/user/invitee',
        {
          headers: {
            Authorization: `Token ${queries.token}`,
          },
        },
      );

      return data;
    } catch (e) {
      return handleClientError<GetProjectInviteForInviteeResponse>(e);
    }
  },
  async replyInvitee(queries: ReplyProjectInviteAuthToken) {
    try {
      const { data } = await http.post<ReplyProjectInviteResponse>(
        '/api/user/reply',
        queries.body,
        {
          headers: {
            Authorization: `Token ${queries.token}`,
          },
        },
      );

      return data;
    } catch (e) {
      return handleClientError<ReplyProjectInviteResponse>(e);
    }
  },
};
