import { client as http } from '@/api/instance';
import type { SignUpResponse } from '@/libs/type/client';
import { handleClientError } from '../handleError';

const client = {
  async healthCheck() {
    try {
      const { data, status } = await http.get('/api');

      return {
        data,
        status,
      };
    } catch (e) {
      handleClientError(e);
    }
  },

  async signUp(payload: FormData) {
    try {
      const { data, status } = await http.post<SignUpResponse>(
        '/api/auth/sign-up',
        payload,
      );

      return {
        data,
        status,
      };
    } catch (e) {
      handleClientError(e);
    }
  },
};

export default client;
