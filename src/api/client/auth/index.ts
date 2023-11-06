import { client as http } from '@/api/instance';
import type {
  SignUpResponse,
  SocialAuthResponse,
  SocialAuthPayload,
  SignUpEmailVerifyPayload,
  SignUpEmailVerifyResponse,
  SignUpEmailVerifyConfirmQuery,
  SignUpEmailVerifyConfirmResponse,
  SignInPayload,
  SignInResponse,
  SignOutAuthToken,
  SignOutResponse,
  PasswordResetResponse,
  PasswordResetPayload,
  PasswordResetCheckQueries,
  PasswordResetCheckResponse,
  PasswordResetConfirmPayload,
  PasswordResetConfirmResponse,
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

export const SignIn = {
  async signIn(payload: SignInPayload) {
    try {
      const { data } = await http.post<SignInResponse>(
        '/api/auth/sign-in',
        payload,
      );

      return data;
    } catch (e) {
      return handleClientError<SignInResponse>(e);
    }
  },
};

export const SignOut = {
  async signOut(param: SignOutAuthToken) {
    try {
      const { data } = await http.get<SignOutResponse>('/api/auth/sign-out', {
        headers: {
          Authorization: `Token ${param.token}`,
        },
      });

      return data;
    } catch (e) {
      return handleClientError<SignOutResponse>(e);
    }
  },
};

export const Password = {
  async passwordReset(payload: PasswordResetPayload) {
    try {
      const { data } = await http.post<PasswordResetResponse>(
        '/api/auth/password/reset',
        payload,
      );

      return data;
    } catch (e) {
      return handleClientError<PasswordResetResponse>(e);
    }
  },

  async passwordResetCheck(queries: PasswordResetCheckQueries) {
    try {
      const { data } = await http.get<PasswordResetCheckResponse>(
        `/api/auth/password/check?email=${queries.email}&token=${queries.token}`,
      );

      return data;
    } catch (e) {
      return handleClientError<PasswordResetCheckResponse>(e);
    }
  },

  async passwordResetConfirm(payload: PasswordResetConfirmPayload) {
    try {
      const { data } = await http.put<PasswordResetConfirmResponse>(
        '/api/auth/password/confirm',
        payload,
      );

      return data;
    } catch (e) {
      return handleClientError<PasswordResetConfirmResponse>(e);
    }
  },
};
