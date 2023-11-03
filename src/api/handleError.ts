/* eslint-disable no-console */
import type { AxiosError } from 'axios';

export function handleClientError<T>(e: unknown) {
  const error = e as AxiosError<T>;

  console.error('클라이언트 서버 에러\n', error);
  return {
    data: error.response?.data,
    status: error.status,
  };
}

export function handleApiError<T>(e: unknown) {
  const error = e as AxiosError<T>;

  console.error('API 서버 에러\n', error);

  return {
    data: error.response?.data,
    status: error.status,
  };
}
