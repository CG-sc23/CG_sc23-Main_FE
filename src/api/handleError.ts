/* eslint-disable no-console */
import type { AxiosError } from 'axios';

export function handleClientError(e: unknown) {
  const error = e as AxiosError;

  console.error('클라이언트 서버 에러\n', error.toJSON());
}

export function handleApiError(e: unknown) {
  const error = e as AxiosError;

  console.error('API 서버 에러\n', error.toJSON());
}
