/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react';
import { useNextRouter } from './useNextRouter';

export function useQueryParams<
  T extends { [key: string]: string } = { [key: string]: string },
>(): Partial<T> {
  const router = useNextRouter();

  return useMemo(() => {
    return router.query as any;
  }, [router]);
}
