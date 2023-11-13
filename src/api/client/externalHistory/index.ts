import { handleClientError } from '@/api/handleError';
import { client as http } from '@/api/instance';
import type {
  GitHubAccountCheckQuery,
  GitHubAccountCheckResponse,
  GitHubStackAuthToken,
  GitHubStackResponse,
  GithubUpdateStatusAuthToken,
  GithubUpdateStatusResponse,
  GitHubManualUpdateAuthToken,
  GitHubManualUpdateResponse,
} from '@/libs/type/client';

export const GitHub = {
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
        `/api/external-history/github/update-status`,
        {
          headers: {
            Authorization: `Token ${queries.token}`,
          },
        },
      );

      return data;
    } catch (e) {
      return handleClientError<GithubUpdateStatusResponse>(e);
    }
  },
  async gitHubStack(queries: GitHubStackAuthToken) {
    try {
      const { data } = await http.get<GitHubStackResponse>(
        `/api/external-history/github/stack`,
        {
          headers: {
            Authorization: `Token ${queries.token}`,
          },
        },
      );

      return data;
    } catch (e) {
      return handleClientError<GitHubStackResponse>(e);
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
