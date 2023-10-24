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
export type ResPostSignUp = {
  success: boolean;
  reason?: string;
};
