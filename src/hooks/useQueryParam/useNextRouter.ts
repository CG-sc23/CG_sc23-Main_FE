/* eslint-disable @typescript-eslint/no-throw-literal */
import Router, { useRouter } from 'next/router';

interface Options {
  suspense?: boolean;
}

function waitForRouterReady() {
  return new Promise<void>((resolve) => {
    Router.ready(resolve);
  });
}

export function useNextRouter(options: Options = { suspense: true }) {
  const router = useRouter();

  if (options.suspense && !router.isReady) {
    throw waitForRouterReady();
  }

  return router;
}
