import {Helmet} from "react-helmet";
import React from "react";

function SEO(pageProps) {
  return (
    <Helmet>
      <title>{pageProps.title}</title>
      <meta name="description" content="Enter text, get keywords." />
      <meta charSet="utf-8" />
      <meta property="og:title" content={pageProps.title} />
      <meta property="og:image" content={pageProps.image} />
      <meta property="og:description" content={pageProps.description} />
      <meta property="og:url" content={pageProps.url} />
    </Helmet>
  );
}

export default SEO;
