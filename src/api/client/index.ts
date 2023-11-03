import { client as http } from '@/api/instance';
import type {
  SignUpResponse,
  SocialAuthResponse,
  SocialAuthPayload,
} from '@/libs/type/client';
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
      return handleClientError<SignUpResponse>(e);
    }
  },

  async socialAuth(payload: SocialAuthPayload) {
    try {
      const { data, status } = await http.post<SocialAuthResponse>(
        '/api/auth/social-auth',
        payload,
      );

      return {
        data,
        status,
      };
    } catch (e) {
      return handleClientError<SocialAuthResponse>(e);
    }
  },
};

export default client;
