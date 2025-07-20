import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: (failureCount, error) => {
          // Don't retry on 401 Unauthorized errors
          if (error?.message?.includes('401') || error?.message?.includes('Unauthorized')) {
            return false;
          }
          return failureCount < 3;
        },
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}

export default MyApp;