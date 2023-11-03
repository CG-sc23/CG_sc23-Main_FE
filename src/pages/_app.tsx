/* eslint-disable react/jsx-no-useless-fragment */
import '@/styles/global.scss';
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Roboto } from 'next/font/google';
import { RecoilRoot } from 'recoil';

const roboto = Roboto({
  weight: ['100', '300', '400', '500', '700', '900'],
});

// if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
//   import('@/api/server/mock');
// }

const queryClient = new QueryClient();

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
          <Component {...pageProps} />
        </RecoilRoot>
      </QueryClientProvider>
    </>
  );
}
