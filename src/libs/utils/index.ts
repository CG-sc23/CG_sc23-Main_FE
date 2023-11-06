import { generateStorage } from '@toss/storage';

export function toUpperCaseFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const userLocalStorage = generateStorage();
