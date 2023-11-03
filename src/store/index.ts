import { atom } from 'recoil';

export const socialPreAccessToken = atom<string | null>({
  key: 'SocialPreAccessToken',
  default: null,
});
