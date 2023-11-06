export type BaseApiResponse = {
  success: boolean;
};

type SuccessAndOptionalReason = BaseApiResponse & { reason?: string };
export type SignUpApiResponse = SuccessAndOptionalReason;
export type SignInApiResponse = SuccessAndOptionalReason;
export type SignOutApiResponse = { success?: boolean; detail?: string };
export type SignUpEmailVerifyApiResponse = SuccessAndOptionalReason;
export type SignUpEmailVerifyConfirmApiResponse = SuccessAndOptionalReason;
export type SocialAuthApiResponse = BaseApiResponse & {
  is_user?: boolean;
  token?: string;
  pre_access_token?: string;
  reason?: string;
};

export type SignInApiPayload = { email: string; password: string };
export type SignOutApiPayload = { token: string };
export type SocialAuthApiPayload = { code: string };
