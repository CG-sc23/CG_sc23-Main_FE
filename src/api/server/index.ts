import { server as http } from '@/api/instance';
import type {
  ResPostSignUp,
  ReqPostSignUp,
  ReqPostGoogle,
  ResPostGoogle,
} from '@/api/type';

const server = {
  async postSingUp(payload: ReqPostSignUp) {
    try {
      const { data, status } = await http.post<ResPostSignUp>(
        '/auth/v1/sign-up',
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
  async postSocialSingUp(payload: ReqPostSignUp) {
    try {
      const { data, status } = await http.post<ResPostSignUp>(
        '/auth/v1/sign-up',
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
  async postGoogle(payload: ReqPostGoogle) {
    try {
      const { data, status } = await http.post<ResPostGoogle>(
        '/auth/v1/social/google',
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
  async postKakao(payload: ReqPostSignUp) {
    try {
      const { data, status } = await http.post<ResPostSignUp>(
        '/auth/v1/social/kakao',
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
