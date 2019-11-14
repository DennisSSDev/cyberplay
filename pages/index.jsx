// index page that next.js will use
import React from 'react';
import { ThemeProvider, Header, createTheme, Arwes, Link, Paragraph } from 'arwes';

import './static/index.css';

const Index = () => {
    return (
        <ThemeProvider theme={createTheme()}>
            <Arwes>
                <Header animate>
                    <Paragraph>
                        <Link href="#">Link</Link>
                    </Paragraph>
                </Header>
            </Arwes>
        </ThemeProvider>
    );
};

export default Index;
