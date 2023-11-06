export type BaseApiResponse = {
  success: boolean;
};

type SuccessAndOptionalReason = BaseApiResponse & { reason?: string };
export type SignUpApiResponse = SuccessAndOptionalReason;
export type SignUpEmailVerifyApiResponse = SuccessAndOptionalReason;
export type SignUpEmailVerifyConfirmApiResponse = SuccessAndOptionalReason;

export type SocialAuthApiPayload = { code: string };
export type SocialAuthApiResponse = BaseApiResponse & {
  is_user?: boolean;
  token?: string;
  pre_access_token?: string;
  reason?: string;
};
