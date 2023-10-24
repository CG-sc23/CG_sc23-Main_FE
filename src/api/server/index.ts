import { server as http } from '@/api/instance';
import type { ResPostSignUp, ReqPostSignUp } from '@/api/type';

const server = {
  async postSingUp(payload: ReqPostSignUp) {
    try {
      const { data, status } = await http.post<ResPostSignUp>(
        '/api/auth/v1/sign-up',
        payload,
      );

      return {
        data,
        status,
      };
    } catch (error) {
      throw new Error('Unknown Error From WAS');
    }
  },
};

export default server;
