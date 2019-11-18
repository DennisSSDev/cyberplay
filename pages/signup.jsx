// index page that next.js will use
import React from 'react';
import { ThemeProvider, createTheme, Arwes, Frame, Button, Line, Image } from 'arwes';
import { Form, FormField, Grommet, Box, RadioButtonGroup } from 'grommet';
import './static/index.css';
import HeaderComponent from '../components/header/component';
import { PropTypes } from 'prop-types';
import { post, useCSRF } from '../util';

const avatars = ['Banshee', 'Snapes', 'Cross', 'Shadow', 'Weebz', 'Connor'];
const theme = createTheme({ animTime: 500 });
const SignUp = () => {
    const [formData, setFormData] = React.useState({});
    const csrf = useCSRF();

    const handleUserInput = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRadioInput = e => {
        setFormData({ ...formData, activeAvatar: e.target.value });
    };

    const submitFormData = () => {
        post('/signup', formData, csrf);
    };

    return (
        <>
            {csrf && (
                <ThemeProvider theme={theme}>
                    <Arwes background="/signup_back.jpeg">
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
                                <h1>Registration Form</h1>
                            </Frame>
                            <Frame level={2} corners={4}>
                                <Grommet
                                    theme={{
                                        formField: { border: { color: '#029CBB', size: 'small' } },
                                        radioButton: { border: { width: '2px', color: '#029CBB' } },
                                    }}
                                >
                                    <Form>
                                        <Box margin="medium" align="center">
                                            <h2>User Data</h2>
                                            <Line />
                                        </Box>
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
                                            <FormField
                                                name="pass2"
                                                label="Retype Password"
                                                type="password"
                                                onChange={handleUserInput}
                                            />
                                        </Box>
                                        <Box margin="medium" align="center">
                                            <h2>Character Data</h2>
                                            <Line />
                                        </Box>
                                        <Box width="medium" flex fill>
                                            <FormField
                                                name="background"
                                                label="Background"
                                                type="text"
                                                help="What happened to you in the past?"
                                                onChange={handleUserInput}
                                            />
                                            <FormField
                                                name="skills"
                                                label="Skills"
                                                type="text"
                                                help="What do you excel at?"
                                                onChange={handleUserInput}
                                            />
                                            <FormField
                                                name="motivation"
                                                label="Motivation"
                                                type="text"
                                                help="What drives you forward?"
                                                onChange={handleUserInput}
                                            />
                                        </Box>
                                        <Box margin="medium" align="center">
                                            <h2>Select Character Avatar</h2>
                                            <Line />
                                        </Box>
                                        <div style={{ display: 'flex' }}>
                                            {[
                                                '/female1.jpg',
                                                '/male1.jpg',
                                                '/female2.jpg',
                                                '/male2.jpeg',
                                                '/female3.jpeg',
                                                '/male3.jpeg',
                                            ].map((val, index) => (
                                                <div key={val} style={{ padding: 20, maxWidth: 700 }}>
                                                    <Image resources={val}>{avatars[index]}</Image>
                                                </div>
                                            ))}
                                        </div>

                                        <RadioButtonGroup
                                            margin={{ left: '25px', right: '25px' }}
                                            justify="between"
                                            direction="row"
                                            name="doc"
                                            options={avatars}
                                            value={formData.activeAvatar}
                                            onChange={handleRadioInput}
                                        />
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

SignUp.propTypes = {
    csrf: PropTypes.string,
};

export default SignUp;
