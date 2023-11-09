import { atom } from 'recoil';

export const socialPreAccessToken = atom<string | null>({
  key: 'SocialPreAccessToken',
  default: null,
});

export const snackBarAtom = atom({
  key: 'SnackBarAtom',
  default: {
    visible: false,
    message: '',
  },
});
