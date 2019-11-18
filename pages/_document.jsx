import React from 'react';
import Document from 'next/document';
import { SheetsRegistry, JssProvider, createGenerateId } from 'react-jss';

export default class JssDocument extends Document {
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
}
/*
render() {
    return (
        <Html>
            <Head>
                <meta name="description" content="Roleplaying Cyberpunk Game" />
                <link rel="shortcut icon" href="static/favicon.ico" />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}*/
