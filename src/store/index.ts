import { atom } from 'recoil';

export const snackBarAtom = atom({
  key: 'SnackBarAtom',
  default: {
    visible: false,
    message: '',
  },
});
