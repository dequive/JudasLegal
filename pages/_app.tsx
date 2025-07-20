import { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#00A859" />
        <meta name="description" content="Assistente jurídico para legislação moçambicana" />
        <title>Judas - Assistente Jurídico Moçambicano</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}