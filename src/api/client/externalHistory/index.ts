import { handleClientError } from '@/api/handleError';
import { client as http } from '@/api/instance';
import type {
  CommonStackQuery,
  CommonStackResponse,
  GitHubAccountCheckQuery,
  GitHubAccountCheckResponse,
  GitHubStackQuery,
  GitHubStackResponse,
  GitHubKeywordQuery,
  GitHubKeywordResponse,
  GithubUpdateStatusAuthToken,
  GithubUpdateStatusResponse,
  GitHubManualUpdateAuthToken,
  GitHubManualUpdateResponse,
} from '@/libs/type/client';

export const GitHub = {
  async commonStack(queries: CommonStackQuery) {
    try {
      const { data } = await http.get<CommonStackResponse>(
        `/api/external-history/common/${queries.stack}`,
      );

      return data;
    } catch (e) {
      return handleClientError<CommonStackResponse>(e);
    }
  },
  async gitHubAccountCheck(queries: GitHubAccountCheckQuery) {
    try {
      const { data } = await http.get<GitHubAccountCheckResponse>(
        `/api/external-history/github/account-check?github_link=${queries.github_link}`,
      );

      return data;
    } catch (e) {
      return handleClientError<GitHubAccountCheckResponse>(e);
    }
  },
  async gitHubUpdateStatus(queries: GithubUpdateStatusAuthToken) {
    try {
      const { data } = await http.get<GithubUpdateStatusResponse>(
        `/api/external-history/github/update-status/${queries.user_id}`,
      );

      return data;
    } catch (e) {
      return handleClientError<GithubUpdateStatusResponse>(e);
    }
  },
  async gitHubStack(queries: GitHubStackQuery) {
    try {
      const { data } = await http.get<GitHubStackResponse>(
        `/api/external-history/github/stack/${queries.user_id}`,
      );

      return data;
    } catch (e) {
      return handleClientError<GitHubStackResponse>(e);
    }
  },
  async gitHubKeyword(queries: GitHubKeywordQuery) {
    try {
      const { data } = await http.get<GitHubKeywordResponse>(
        `/api/external-history/github/keyword/${queries.user_id}`,
      );

      return data;
    } catch (e) {
      return handleClientError<GitHubKeywordResponse>(e);
    }
  },
  async gitHubManualUpdate(queries: GitHubManualUpdateAuthToken) {
    try {
      const { data } = await http.post<GitHubManualUpdateResponse>(
        `/api/external-history/github/manual-update`,
        {},
        {
          headers: {
            Authorization: `Token ${queries.token}`,
          },
        },
      );

      return data;
    } catch (e) {
      return handleClientError<GitHubManualUpdateResponse>(e);
    }
  },
};
