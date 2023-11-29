/* eslint-disable no-console */
import type { AxiosError } from 'axios';

export function handleClientError<T>(e: unknown) {
  const error = e as AxiosError<T>;
  const data = error.response?.data;

  console.error('클라이언트 서버 에러: ', data);

  return data;
}

export function handleApiError<T>(e: unknown) {
  const error = e as AxiosError<T>;
  const data = error.response?.data;

  console.error('\u001b[31mAPI 서버 에러\u001b[0m: ', data);

  return { data };
}
