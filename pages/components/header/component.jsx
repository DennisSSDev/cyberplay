import React from 'react';
import { Header, Paragraph, Button, Link } from 'arwes';

const VisualComponent = () => {
    return (
        <Header animate>
            <Paragraph>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center ',
                        justifyContent: 'space-between',
                    }}
                >
                    <h1 style={{ margin: 0, paddingLeft: 50, marginTop: 8 }}>
                        <Link href="/">Cyber Play</Link>
                    </h1>
                    <div style={{ display: 'flex', flexDirection: 'row', marginRight: 50 }}>
                        <Link href="/login">
                            <Button animate style={{ margin: 0, marginRight: 20, marginTop: 15 }}>
                                Login
                            </Button>
                        </Link>
                        <Link href="/signup">
                            <Button animate style={{ margin: 0, marginTop: 15 }}>
                                Sign up
                            </Button>
                        </Link>
                    </div>
                </div>
            </Paragraph>
        </Header>
    );
};

export const HeaderComponent = VisualComponent;
