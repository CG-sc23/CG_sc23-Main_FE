import '@/styles/global.scss';
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Roboto } from 'next/font/google';
import { RecoilRoot } from 'recoil';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import MenuBar from '@/components/MenuBar';
import User from '@/components/User';

const roboto = Roboto({
  weight: ['100', '300', '400', '500', '700', '900'],
});

// if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
//   import('@/api/server/mock');
// }

export const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <style jsx global>{`
        html {
          font-family: ${roboto.style.fontFamily};
        }
      `}</style>
      <QueryClientProvider client={queryClient}>
        <RecoilRoot>
          <User>
            <MenuBar>
              <Component {...pageProps} />
            </MenuBar>
          </User>
          <ReactQueryDevtools />
        </RecoilRoot>
      </QueryClientProvider>
    </>
  );
}
