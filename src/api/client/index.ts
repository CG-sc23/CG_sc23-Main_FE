import { client as http } from '@/api/instance';
import type {
  DefaultResponse,
  ReqPostSignUp,
  ReqPostGoogle,
  ResPostGoogle,
} from '@/api/type';

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
  async socialAuth(payload: ReqPostGoogle) {
    try {
      const { data, status } = await http.post<ResPostGoogle>(
        '/api/auth/social-auth',
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
  async signIp(payload: ReqPostSignUp) {
    try {
      const { data, status } = await http.post<DefaultResponse>(
        '/api/auth/sign-in',
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
  async signOut(payload: ReqPostSignUp) {
    try {
      const { data, status } = await http.post<DefaultResponse>(
        '/api/auth/sign-out',
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
