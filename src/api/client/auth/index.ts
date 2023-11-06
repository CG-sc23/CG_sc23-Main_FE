import { client as http } from '@/api/instance';
import type {
  SignUpResponse,
  SocialAuthResponse,
  SocialAuthPayload,
  SignUpEmailVerifyPayload,
  SignUpEmailVerifyResponse,
  SignUpEmailVerifyConfirmQuery,
  SignUpEmailVerifyConfirmResponse,
} from '@/libs/type/client';
import { handleClientError } from '@/api/handleError';

export const SignUp = {
  async signUp(payload: FormData) {
    try {
      const { data } = await http.post<SignUpResponse>(
        '/api/auth/sign-up',
        payload,
      );

      return data;
    } catch (e) {
      return handleClientError<SignUpResponse>(e);
    }
  },

  async socialAuth(payload: SocialAuthPayload) {
    try {
      const { data } = await http.post<SocialAuthResponse>(
        '/api/auth/social-auth',
        payload,
      );

      return data;
    } catch (e) {
      return handleClientError<SocialAuthResponse>(e);
    }
  },

  async signUpEmailVerify(payload: SignUpEmailVerifyPayload) {
    try {
      const { data } = await http.post<SignUpEmailVerifyResponse>(
        '/api/auth/sign-up-email-verify',
        payload,
      );

      return data;
    } catch (e) {
      return handleClientError<SignUpEmailVerifyResponse>(e);
    }
  },

  async signUpEmailVerifyConfirm(query: SignUpEmailVerifyConfirmQuery) {
    try {
      const { data } = await http.get<SignUpEmailVerifyConfirmResponse>(
        `/api/auth/sign-up-email-verify-confirm?email=${query.email}&token=${query.token}`,
      );

      return data;
    } catch (e) {
      return handleClientError<SignUpEmailVerifyConfirmResponse>(e);
    }
  },
};
