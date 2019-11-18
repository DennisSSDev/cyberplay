import React from 'react';
import App from 'next/app';
import Head from 'next/head';
import { Arwes, ThemeProvider, createTheme } from 'arwes';

export default class MyApp extends App {
    componentDidMount() {
        const style = document.getElementById('server-side-styles');

        if (style) {
            style.parentNode.removeChild(style);
        }
    }

    render() {
        const theme = createTheme();
        const { Component, pageProps } = this.props;

        return (
            <>
                <Head>
                    <title>CyberPlay</title>
                </Head>
                <ThemeProvider theme={theme}>
                    <Arwes background="/cyberback.jpg">
                        <Component {...pageProps} />
                    </Arwes>
                </ThemeProvider>
            </>
        );
    }
}
