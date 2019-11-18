// index page that next.js will use
import React from 'react';
import { Logo, Words, Frame, Button, Link, createTheme, ThemeProvider, Arwes } from 'arwes';

import './static/index.css';
import HeaderComponent from '../components/header/component';

const Index = () => {
    return (
        <>
            <div>
                <HeaderComponent />
            </div>
            <div style={{ margin: '0 auto', display: 'flex', justifyContent: 'center', paddingTop: 50 }}>
                <Logo animate size={130} />
            </div>
            <div style={{ margin: '0 auto', paddingLeft: '20%', paddingRight: '20%', marginTop: '5%' }}>
                <Frame animate level={2} corners={4}>
                    <p style={{ marginLeft: 20 }}>
                        <Words animate animation={{ timeout: 2000 }}>
                            A SciFi role-playing & texting game abou finding your destiny in the world of Cyberpunk.
                        </Words>
                    </p>
                </Frame>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 60 }}>
                <Link href="/signup">
                    <Button level={3} animate>
                        Begin your journey here
                    </Button>
                </Link>
            </div>
        </>
    );
};

export default Index;
