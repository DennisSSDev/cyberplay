import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { JssProvider, createGenerateId, SheetsRegistry } from 'react-jss';

/**
 * Override to be able to serve favicon
 */
class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const registry = new SheetsRegistry();
    const generateId = createGenerateId();
    const originalRenderPage = ctx.renderPage;
    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: App => props => (
          <JssProvider registry={registry} generateId={generateId}>
            <App {...props} />
          </JssProvider>
        ),
      });

    const initialProps = await Document.getInitialProps(ctx);

    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles}
          <style id="server-side-styles">{registry.toString()}</style>
        </>
      ),
    };
  }

  render() {
    return (
      <Html>
        <Head>
          <meta property="og:title" content="Cyber Play" />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://cyber-play.herokuapp.com" />
          <meta
            property="og:image"
            content="https://cyber-play.herokuapp.com/cyberback.jpg"
          />
          <meta
            property="og:description"
            content="Roleplaying Texting Cyberpunk Game"
          />
          <meta
            name="description"
            content="Roleplaying Texting Cyberpunk Game "
          />
          <meta name="theme-color" content="#029CBB" />
          <meta name="twitter:card" content="summary_large_image" />
          <link rel="shortcut icon" href="static/favicon.ico" />
          <link type="application/json+oembed" href="/provider.json" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
