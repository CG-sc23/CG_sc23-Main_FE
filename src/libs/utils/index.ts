import { generateStorage } from '@toss/storage';

export function toUpperCaseFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function hexToRgba(hex: `#${string}`, opacity: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export function preProcessCommonStackName(name: string) {
  if (name === 'CSS') return 'css3';
  if (name === 'html') return 'html5';
  if (name === 'next') return 'nextjs';
  if (name === 'node') return 'nodejs';

  return name;
}

export const userLocalStorage = generateStorage();
