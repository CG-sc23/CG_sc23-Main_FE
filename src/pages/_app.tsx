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

// import '@uiw/react-md-editor/dist/markdown-editor.css';
// import '@uiw/react-md-editor/lib/esm/components/DragBar/index.css';
// import '@uiw/react-md-editor/lib/esm/components/TextArea/index.css';
// import '@uiw/react-md-editor/lib/esm/components/Toolbar/index.css';
// import '@uiw/react-md-editor/lib/esm/components/Toolbar/Child.css';

const MenuBar = dynamic(() => import('@/components/MenuBar'), {
  ssr: false,
  loading: () => <NavContainer />,
});

export const roboto = Roboto({
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
        .w-md-editor {
          --md-editor-font-family: ${roboto.style.fontFamily} !important;
        }
        .w-md-editor-text-input,
        .w-md-editor-text-pre > code,
        .w-md-editor-text-pre > code > span,
        .w-md-editor-text-pre {
          font-family: ${roboto.style.fontFamily} !important;
          font-size: 1.2rem !important;
          line-height: 1.5rem !important;
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
