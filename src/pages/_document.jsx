import { Html, Head, Main, NextScript } from 'next/document';
import config from '../utils/config.json';
import { useEffect, useState } from 'react';

export default function Document() {
  const [url, setUrl] = useState('');
  useEffect(() => {
    setUrl(`https://${window.location.host}/`);
  }, []);
  return (
    <Html>
      <Head>
        <meta name="author" content="kamal kashyap" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href={`${config.logo}`} type="image/x-ico" />
        <link rel="apple-touch-icon" href={`${config.logo}`}></link>
        <meta name="theme-color" content="#292929" />
        <meta property="og:image" content={`${config.opImage}`} />
        <meta name="application-name" content={`${config.name}`} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={`${config.name}`} />
        <meta name="description" content={`${config.description}`} />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#292929" />
        <meta name="msapplication-tap-highlight" content="no" />
        <link rel="mask-icon" href={`${config.logo}`} />
        <link rel="shortcut icon" href={`${config.logo}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={url} />
        <meta name="twitter:title" content={`${config.name}`} />
        <meta name="twitter:description" content={`${config.description}`} />
        <meta name="twitter:image" content={`${config.opImage}`} />
        <meta name="twitter:creator" content="@thekamalkashyap" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`${config.name}`} />
        <meta property="og:description" content={`${config.description}`} />
        <meta property="og:site_name" content={`${config.name}`} />
        <meta property="og:url" content={url} />
        <link rel="apple-touch-startup-image" href={`${config.logo}`} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
