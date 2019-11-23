import React from 'react';
import App from 'next/app';
import Head from 'next/head';

export default class MyApp extends App {
  componentDidMount() {
    const style = document.getElementById('server-side-styles');

    if (style) {
      style.parentNode.removeChild(style);
    }
  }
  render() {
    const { Component, pageProps } = this.props;

    return (
      <>
        <Head>
          <title>CyberPlay</title>
        </Head>

        <Component {...pageProps} />
      </>
    );
  }
}
