import '@/styles/global.scss';
import type { AppProps } from 'next/app';
import {
  HydrationBoundary,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

import { Roboto } from 'next/font/google';
import { RecoilRoot } from 'recoil';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Layout from '@/components/Layout';
import SnackBar from '@/components/SnackBar';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { NavContainer } from '@/components/MenuBar';

const MenuBar = dynamic(() => import('@/components/MenuBar'), {
  ssr: false,
  loading: () => <NavContainer />,
});

const roboto = Roboto({
  weight: ['100', '300', '400', '500', '700', '900'],
  subsets: [
    'cyrillic',
    'cyrillic-ext',
    'greek',
    'greek-ext',
    'latin',
    'latin-ext',
    'vietnamese',
  ],
});

// if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
//   import('@/api/server/mock');
// }

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      }),
  );

  return (
    <>
      <style jsx global>{`
        html {
          font-family: ${roboto.style.fontFamily};
        }
      `}</style>
      <QueryClientProvider client={queryClient}>
        <HydrationBoundary state={pageProps.dehydratedState}>
          <RecoilRoot>
            <Layout>
              <MenuBar />
              <SnackBar />
              <Component {...pageProps} />
            </Layout>
            <ReactQueryDevtools />
          </RecoilRoot>
        </HydrationBoundary>
      </QueryClientProvider>
    </>
  );
}
