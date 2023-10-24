import { client as http } from '@/api/instance';
import type { DefaultResponse, ReqPostSignUp } from '@/api/type';

const client = {
  async signUp(payload: ReqPostSignUp) {
    try {
      const { data, status } = await http.post<DefaultResponse>(
        '/api/auth/sign-up',
        payload,
      );

      return {
        data,
        status,
      };
    } catch (error) {
      throw new Error('Unknown Error: From API Route');
    }
  },
};

export default client;
