import { handleApiError } from '@/api/handleError';
import { server as http } from '@/api/instance';
import type {
  CommonStackApiQuery,
  CommonStackApiResponse,
  GitHubAccountCheckApiQuery,
  GitHubAccountCheckApiResponse,
  GitHubStackApiQuery,
  GitHubStackApiResponse,
  GitHubKeywordApiQuery,
  GitHubKeywordApiResponse,
  GithubUpdateStatusApiAuthToken,
  GithubUpdateStatusApiResponse,
  GitHubManualUpdateApiAuthToken,
  GitHubManualUpdateApiResponse,
} from '@/libs/type/server';

export const GitHub = {
  async getCommonStack(queries: CommonStackApiQuery) {
    try {
      return await http.get<CommonStackApiResponse>(
        `/external-history/v1/common/stack/${queries.stack}`,
      );
    } catch (e) {
      return handleApiError<CommonStackApiResponse>(e);
    }
  },
  async getGitHubAccountCheck(queries: GitHubAccountCheckApiQuery) {
    try {
      return await http.get<GitHubAccountCheckApiResponse>(
        `/external-history/v1/github/check?github_link=${queries.github_link}`,
      );
    } catch (e) {
      return handleApiError<GitHubAccountCheckApiResponse>(e);
    }
  },
  async getGitHubUpdateStatus(queries: GithubUpdateStatusApiAuthToken) {
    try {
      return await http.get<GithubUpdateStatusApiResponse>(
        `/external-history/v1/github/status`,
        {
          headers: {
            Authorization: `Token ${queries.token}`,
          },
        },
      );
    } catch (e) {
      return handleApiError<GithubUpdateStatusApiResponse>(e);
    }
  },
  async getGitHubStack(queries: GitHubStackApiQuery) {
    try {
      return await http.get<GitHubStackApiResponse>(
        `/external-history/v1/github/stack/${queries.user_id}`,
      );
    } catch (e) {
      return handleApiError<GitHubStackApiResponse>(e);
    }
  },
  async getGitHubKeyword(queries: GitHubKeywordApiQuery) {
    try {
      return await http.get<GitHubKeywordApiResponse>(
        `/external-history/v1/github/keyword/${queries.user_id}`,
      );
    } catch (e) {
      return handleApiError<GitHubKeywordApiResponse>(e);
    }
  },
  async postGitHubManualUpdate(queries: GitHubManualUpdateApiAuthToken) {
    try {
      return await http.post<GitHubManualUpdateApiResponse>(
        `/external-history/v1/github/update`,
        {},
        {
          headers: {
            Authorization: `Token ${queries.token}`,
          },
        },
      );
    } catch (e) {
      return handleApiError<GitHubManualUpdateApiResponse>(e);
    }
  },
};
