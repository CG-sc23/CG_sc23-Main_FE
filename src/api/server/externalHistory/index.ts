import { handleApiError } from '@/api/handleError';
import { server as http } from '@/api/instance';
import type {
  GitHubAccountCheckApiQuery,
  GitHubAccountCheckApiResponse,
  GitHubStackApiAuthToken,
  GitHubStackApiResponse,
  GithubUpdateStatusApiAuthToken,
  GithubUpdateStatusApiResponse,
  GitHubManualUpdateApiAuthToken,
  GitHubManualUpdateApiResponse,
} from '@/libs/type/server';

export const GitHub = {
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
  async getGitHubStack(queries: GitHubStackApiAuthToken) {
    try {
      return await http.get<GitHubStackApiResponse>(
        `/external-history/v1/github/stack`,
        {
          headers: {
            Authorization: `Token ${queries.token}`,
          },
        },
      );
    } catch (e) {
      return handleApiError<GitHubStackApiResponse>(e);
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
