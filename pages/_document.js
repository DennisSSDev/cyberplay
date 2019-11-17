import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';

/**
 * Override to be able to serve favicon
 */
class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx);
        return { ...initialProps };
    }

    render() {
        return (
            <Html>
                <Head>
                    <meta name="CyberPlay" content="Roleplaying Cyberpunk Game" />
                    <link rel="shortcut icon" href="static/favicon.ico" />
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
