export type BaseApiResponse = {
  success: boolean;
};

type SuccessAndOptionalReason = BaseApiResponse & { reason?: string };
export type SignUpApiResponse = SuccessAndOptionalReason;
export type SignInApiResponse = SuccessAndOptionalReason & { token?: string };
export type SignOutApiResponse = { success?: boolean; detail?: string };
export type SignUpEmailVerifyApiResponse = SuccessAndOptionalReason;
export type SignUpEmailVerifyConfirmApiResponse = SuccessAndOptionalReason;
export type PasswordResetApiResponse = SuccessAndOptionalReason;
export type PasswordResetApiPayload = { email: string };
export type PasswordResetCheckApiResponse = SuccessAndOptionalReason;
export type PasswordResetCheckApiQueries = PasswordResetApiPayload & {
  token: string;
};
export type PasswordResetConfirmApiResponse = SuccessAndOptionalReason;
export type PasswordResetConfirmApiPayload = PasswordResetCheckApiQueries & {
  new_password: string;
};
export type SocialAuthApiResponse = BaseApiResponse & {
  is_user?: boolean;
  token?: string;
  pre_access_token?: string;
  reason?: string;
};

export type SignInApiPayload = { email: string; password: string };
export type SignOutApiAuthToken = { token: string };
export type SocialAuthApiPayload = { code: string };

/** USER */
export type DeactivateApiAuthToken = { token: string };
export type DeactivateApiResponse = { success?: boolean; detail?: string };
export type GetUserInfoApiAuthToken = { token: string };
export type GetUserInfoApiResponse = {
  success?: boolean;
  email?: string;
  name?: string;
  profile_image_link?: string | null;
  detail?: string;
};
