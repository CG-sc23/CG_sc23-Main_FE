export type DefaultResponse<T = string> = {
  ok: boolean;
  value?: T;
};

export type ReqPostSignUp = {
  email: string;
  password: string;
  name: string;
  short_description: string;
  description: string;
};

export type ReqPostGoogle = {
  code: string;
};

export type ResPostSignUp = {
  success: boolean;
  reason?: string;
};

export type ResPostGoogle = {
  success: boolean;
  is_user?: boolean;
  token?: string;
  pre_access_token?: string;
  reason?: string;
};
