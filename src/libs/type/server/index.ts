export type BaseApiResponse = {
  success: boolean;
};

export type SignUpApiResponse = BaseApiResponse & { reason?: string };
