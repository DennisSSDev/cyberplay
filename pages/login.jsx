// index page that next.js will use
import React from 'react';
import { ThemeProvider, createTheme, Arwes, Frame, Button } from 'arwes';
import { Form, FormField, Grommet, Box } from 'grommet';
import './static/index.css';
import HeaderComponent from './../components/header/component';
import { post, useCSRF, isLoggedOut } from '../util';
import Router from 'next/router';

const theme = createTheme({ animTime: 500 });

const LogIn = () => {
    const [formData, setFormData] = React.useState({});
    const csrf = useCSRF();

    const handleUserInput = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const submitFormData = async () => {
        const res = await post('/login', formData, csrf);
        if (!res.ok) return; // todo: show error message
        const json = await res.json();
        console.log(json);
        if (json.url) {
            Router.push(json.url);
        }
    };
    return (
        <>
            {csrf && (
                <ThemeProvider theme={theme}>
                    <Arwes animate background="/login_back.jpeg">
                        <div>
                            <HeaderComponent />
                        </div>
                        <div
                            style={{
                                margin: '0 auto',
                                paddingLeft: '18%',
                                paddingRight: '18%',
                                marginTop: '5%',
                                paddingBottom: 50,
                            }}
                        >
                            <Frame style={{ marginBottom: 20, textAlign: 'center' }}>
                                <h1>Welcome Back</h1>
                            </Frame>
                            <Frame level={1} corners={4}>
                                <Grommet
                                    theme={{
                                        formField: { border: { color: '#029CBB', size: 'small' } },
                                        radioButton: { border: { width: '2px', color: '#029CBB' } },
                                    }}
                                >
                                    <Form>
                                        <Box width="medium" flex fill>
                                            <FormField
                                                name="username"
                                                label="UserName"
                                                type="text"
                                                onChange={handleUserInput}
                                            />
                                            <FormField
                                                name="pass"
                                                label="Password"
                                                type="password"
                                                onChange={handleUserInput}
                                            />
                                        </Box>
                                        <Box align="center" margin="medium">
                                            <Button
                                                color="#25DAFD"
                                                type="submit"
                                                primary
                                                label="Submit"
                                                layer="success"
                                                onClick={submitFormData}
                                            >
                                                Enter the Cyberpunk
                                            </Button>
                                        </Box>
                                    </Form>
                                </Grommet>
                            </Frame>
                        </div>
                    </Arwes>
                </ThemeProvider>
            )}
        </>
    );
};

LogIn.getInitialProps = async ({ req, res }) => {
    isLoggedOut(req, res);
    return {};
};

export default LogIn;
