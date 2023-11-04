import type FormData from 'form-data';

import { server as http } from '@/api/instance';
import type { BaseApiResponse, SignUpApiResponse } from '@/libs/type/server';
import { handleApiError } from '../handleError';

const server = {
  async getHealthCheck() {
    try {
      const { data, status } = await http.get<BaseApiResponse>('/');

      return { data, status };
    } catch (e) {
      handleApiError(e);
    }
  },

  async postSingUp(payload: FormData) {
    try {
      const { data, status } = await http.post<SignUpApiResponse>(
        '/auth/v1/sign-up',
        payload,
      );

      return {
        data,
        status,
      };
    } catch (e) {
      handleApiError(e);
    }
  },
};

export default server;
