import type FormData from 'form-data';

import { server as http } from '@/api/instance';
import type {
  SignUpApiResponse,
  SocialAuthApiPayload,
  SocialAuthApiResponse,
  SignUpEmailVerifyApiResponse,
  SignUpEmailVerifyConfirmApiResponse,
  SignInApiPayload,
  SignInApiResponse,
  SignOutApiResponse,
  SignOutApiAuthToken,
  PasswordResetApiPayload,
  PasswordResetApiResponse,
  PasswordResetCheckApiQueries,
  PasswordResetCheckApiResponse,
  PasswordResetConfirmApiPayload,
  PasswordResetConfirmApiResponse,
} from '@/libs/type/server';
import { handleApiError } from '@/api/handleError';

export const SignUp = {
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

  async postSignUpEmailVerify(payload: { email: string }) {
    try {
      const { data, status } = await http.post<SignUpEmailVerifyApiResponse>(
        '/auth/v1/sign-up-email-verify',
        payload,
      );

      return {
        data,
        status,
      };
    } catch (e) {
      return handleApiError<SignUpEmailVerifyApiResponse>(e);
    }
  },

  async getSignUpEmailVerifyConfirm(query: { email: string; token: string }) {
    try {
      const { data, status } =
        await http.get<SignUpEmailVerifyConfirmApiResponse>(
          `/auth/v1/sign-up-email-verify-confirm?email=${query.email}&token=${query.token}`,
        );

      return {
        data,
        status,
      };
    } catch (e) {
      return handleApiError<SignUpEmailVerifyConfirmApiResponse>(e);
    }
  },
};

export const SignIn = {
  async postSignIn(payload: SignInApiPayload) {
    try {
      const { data, status } = await http.post<SignInApiResponse>(
        '/auth/v1/sign-in',
        payload,
      );

      return {
        data,
        status,
      };
    } catch (e) {
      return handleApiError<SignInApiResponse>(e);
    }
  },
};

export const SignOut = {
  async getSignOut(authHeader: SignOutApiAuthToken) {
    try {
      return await http.get<SignOutApiResponse>('/auth/v1/sign-out', {
        headers: {
          Authorization: `Token ${authHeader.token}`,
        },
      });
    } catch (e) {
      return handleApiError<SignOutApiResponse>(e);
    }
  },
};

export const SocialAuth = {
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

export const Password = {
  async postPasswordReset(payload: PasswordResetApiPayload) {
    try {
      return await http.post<PasswordResetApiResponse>(
        '/auth/v1/password-reset',
        payload,
      );
    } catch (e) {
      return handleApiError<PasswordResetApiResponse>(e);
    }
  },
  async getPasswordResetCheck(queries: PasswordResetCheckApiQueries) {
    try {
      return await http.get<PasswordResetCheckApiResponse>(
        `/auth/v1/password-reset-check?email=${queries.email}&token=${queries.token}`,
      );
    } catch (e) {
      return handleApiError<PasswordResetCheckApiResponse>(e);
    }
  },
  async putPasswordResetConfirm(payload: PasswordResetConfirmApiPayload) {
    try {
      return await http.put<PasswordResetConfirmApiResponse>(
        `/auth/v1/password-reset-confirm`,
        payload,
      );
    } catch (e) {
      return handleApiError<PasswordResetConfirmApiResponse>(e);
    }
  },
};
