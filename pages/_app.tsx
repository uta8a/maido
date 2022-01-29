import type { AppProps } from 'next/app';
import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';

const MyApp: NextPage<AppProps> = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <link rel="icon shortcut" href="/favicon.png" />
        <meta httpEquiv="Content-Type" content="text/html" charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Component {...pageProps} />
    </>
  );
};

export default MyApp;
