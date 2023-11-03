export type BaseApiResponse = {
  success: boolean;
};

export type SignUpApiResponse = BaseApiResponse & { reason?: string };

export type SocialAuthApiPayload = { code: string };
export type SocialAuthApiResponse = BaseApiResponse & {
  is_user?: boolean;
  token?: string;
  pre_access_token?: string;
  reason?: string;
};
