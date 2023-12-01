import { handleApiError } from '@/api/handleError';
import { server as http } from '@/api/instance';
import {
  DeactivateApiAuthToken,
  DeactivateApiResponse,
  GetUserInfoApiAuthToken,
  GetUserInfoApiResponse,
  UserDetailInfoApiQuery,
  UserDetailInfoApiResponse,
  ModifyUserDetailInfoApiAuthTokenAndBody,
  ModifyUserDetailInfoApiResponse,
  SearchApiParams,
  SearchApiResponse,
  RecommendedUserApiAuthToken,
  RecommendedUserApiResponse,
  GetProjectInviteForInviterApiAuthToken,
  GetProjectInviteForInviterApiResponse,
  GetProjectInviterForInviteeApiAuthToken,
  GetProjectInviterForInviteeApiResponse,
  ReplyProjectInviteApiAuthToken,
  ReplyProjectInviteApiResponse,
  GetProjectsInfoApiQuery,
  GetProjectsInfoResponse,
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
  async getUserProjectsInfo(query: GetProjectsInfoApiQuery) {
    try {
      return await http.get<GetProjectsInfoResponse>(
        `/user/v1/projects/${query.user_id}`,
      );
    } catch (e) {
      return handleApiError<GetProjectsInfoResponse>(e);
    }
  },
  async getUserDetailInfo(query: UserDetailInfoApiQuery) {
    try {
      return await http.get<UserDetailInfoApiResponse>(
        `/user/v1/detail/${query.user_id}`,
      );
    } catch (e) {
      return handleApiError<UserDetailInfoApiResponse>(e);
    }
  },
  async putModifyUserInfo(payload: ModifyUserDetailInfoApiAuthTokenAndBody) {
    try {
      return await http.put<ModifyUserDetailInfoApiResponse>(
        `/user/v1/detail/own`,
        payload.body,
        {
          headers: {
            Authorization: `Token ${payload.token}`,
          },
        },
      );
    } catch (e) {
      return handleApiError<ModifyUserDetailInfoApiResponse>(e);
    }
  },
  async getSearchUser(query: SearchApiParams) {
    try {
      return await http.get<SearchApiResponse>(
        `/user/v1/search?request-data=${query.request_data}`,
      );
    } catch (e) {
      return handleApiError<SearchApiResponse>(e);
    }
  },
  async getUserRecommendation(queries: RecommendedUserApiAuthToken) {
    try {
      return await http.get<RecommendedUserApiResponse>(`/user/v1/recommend`, {
        headers: {
          Authorization: `Token ${queries.token}`,
        },
      });
    } catch (e) {
      return handleApiError<RecommendedUserApiResponse>(e);
    }
  },
  async getProjectInviteForInviter(
    queries: GetProjectInviteForInviterApiAuthToken,
  ) {
    try {
      return await http.get<GetProjectInviteForInviterApiResponse>(
        `/user/v1/inviter`,
        {
          headers: {
            Authorization: `Token ${queries.token}`,
          },
        },
      );
    } catch (e) {
      return handleApiError<GetProjectInviteForInviterApiResponse>(e);
    }
  },
  async getProjectInviteForInvitee(
    queries: GetProjectInviterForInviteeApiAuthToken,
  ) {
    try {
      return await http.get<GetProjectInviterForInviteeApiResponse>(
        `/user/v1/invitee`,
        {
          headers: {
            Authorization: `Token ${queries.token}`,
          },
        },
      );
    } catch (e) {
      return handleApiError<GetProjectInviterForInviteeApiResponse>(e);
    }
  },
  async postReplyProjectInvite(queries: ReplyProjectInviteApiAuthToken) {
    try {
      return await http.post<ReplyProjectInviteApiResponse>(
        `/user/v1/invitee/reply`,
        queries.body,
        {
          headers: {
            Authorization: `Token ${queries.token}`,
          },
        },
      );
    } catch (e) {
      return handleApiError<ReplyProjectInviteApiResponse>(e);
    }
  },
};
