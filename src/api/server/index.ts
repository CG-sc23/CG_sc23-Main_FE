import type FormData from 'form-data';

import { server as http } from '@/api/instance';
import type {
  BaseApiResponse,
  SignUpApiResponse,
  SocialAuthApiPayload,
  SocialAuthApiResponse,
} from '@/libs/type/server';
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

  async postSignUp(payload: FormData) {
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
      return handleApiError<SignUpApiResponse>(e);
    }
  },

  async postSocialSignUp(payload: FormData) {
    try {
      const { data, status } = await http.post<SignUpApiResponse>(
        '/auth/v1/social/sign-up',
        payload,
      );

      return {
        data,
        status,
      };
    } catch (e) {
      return handleApiError<SignUpApiResponse>(e);
    }
  },

  async postKakao(payload: SocialAuthApiPayload) {
    try {
      const { data, status } = await http.post<SocialAuthApiResponse>(
        '/auth/v1/social/kakao',
        payload,
      );

      return {
        data,
        status,
      };
    } catch (e) {
      return handleApiError<SocialAuthApiResponse>(e);
    }
  },

  async postNaver(payload: SocialAuthApiPayload) {
    try {
      const { data, status } = await http.post<SocialAuthApiResponse>(
        '/auth/v1/social/naver',
        payload,
      );

      return {
        data,
        status,
      };
    } catch (e) {
      return handleApiError<SocialAuthApiResponse>(e);
    }
  },
};

export default server;
