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

export function preProcessCommonStackName(str: string) {
  const name = str.replace(' ', '').toLocaleLowerCase();
  if (name === 'css') return 'css3';
  if (name === 'html') return 'html5';
  if (name === 'vue') return 'vue.js';
  if (name === 'next') return 'nextjs';
  if (name === 'nest') return 'nestjs';
  if (name === 'node') return 'nodejs';
  if (name === 'express') return 'express.js';

  return name;
}

export function getRandomHexColor() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

export const extractLogoHexFromUrl = (url: string): string | null => {
  const logoColorHexMatch = url.match(/logoColor=%23([0-9A-Fa-f]{6})/);
  if (logoColorHexMatch) return logoColorHexMatch[1];

  const logoColorHexMatchWithout23 = url.match(/logoColor=([0-9A-Fa-f]{6})/);
  if (logoColorHexMatchWithout23) return logoColorHexMatchWithout23[1];

  const languageHexMatch = url.match(/-%23([0-9A-Fa-f]{6})/);
  if (languageHexMatch) return languageHexMatch[1];

  const languageHexMatchWithout23 = url.match(/-([0-9A-Fa-f]{6})\?style/);
  if (languageHexMatchWithout23) return languageHexMatchWithout23[1];

  const languageWordMatch = url.match(/-([0-9A-Za-z]+)\?style/);
  if (languageWordMatch)
    return languageWordMatch[1] === 'black' ? '000000' : 'ffffff';

  return getRandomHexColor();
};

export const extractBGHexFromUrl = (url: string): string | null => {
  const languageHexMatch = url.match(/-%23([0-9A-Fa-f]{6})/);
  if (languageHexMatch) return languageHexMatch[1];

  const languageHexMatchWithout23 = url.match(/-([0-9A-Fa-f]{6})\?style/);
  if (languageHexMatchWithout23) return languageHexMatchWithout23[1];

  const languageWordMatch = url.match(/-([0-9A-Za-z]+)\?style/);
  if (languageWordMatch)
    return languageWordMatch[1] === 'black' ? '000000' : 'ffffff';

  const logoColorHexMatch = url.match(/logoColor=%23([0-9A-Fa-f]{6})/);
  if (logoColorHexMatch) return logoColorHexMatch[1];

  const logoColorHexMatchWithout23 = url.match(/logoColor=([0-9A-Fa-f]{6})/);
  if (logoColorHexMatchWithout23) return logoColorHexMatchWithout23[1];

  return getRandomHexColor();
};

export const userLocalStorage = generateStorage();
