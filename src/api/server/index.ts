import type { BaseApiResponse } from '@/libs/type/server';

import { server as http } from '@/api/instance';
import {
  SignUp,
  SocialAuth,
  SignIn,
  SignOut,
  Password,
} from '@/api/server/auth';
import { handleApiError } from '@/api/handleError';

const server = {
  async getHealthCheck() {
    try {
      const { data, status } = await http.get<BaseApiResponse>('/');

      return { data, status };
    } catch (e) {
      handleApiError(e);
    }
  },

  ...SignUp,
  ...SignIn,
  ...SignOut,
  ...SocialAuth,
  ...Password,
};

export default server;
