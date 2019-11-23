import React from 'react';
import { ThemeProvider, createTheme, Arwes, Frame, Button } from 'arwes';
import { Form, FormField, Grommet, Box } from 'grommet';
import './static/index.css';
import { LoggedInHeaderComponent } from './../components/header/component';
import { post, useCSRF, isLoggedIn } from '../util';
import Router from 'next/router';

const theme = createTheme({ animTime: 500 });

const MissionMaker = () => {
  const [formData, setFormData] = React.useState({});
  const csrf = useCSRF();

  const handleUserInput = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value, error: '' });
  };

  const submitFormData = async () => {
    const res = await post('/makemission', formData, csrf);
    if (!res.ok) {
      const json = await res.json();
      setFormData({ ...formData, error: json.error });
      return;
    }
    // the mission creation worked -> return to dashboard
    Router.push('/dashboard');
  };
  return (
    <>
      {csrf && (
        <ThemeProvider theme={theme}>
          <Arwes animate background="/maker.jpeg">
            <div>
              <LoggedInHeaderComponent />
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
                <h1>Create Mission</h1>
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
                        name="title"
                        label="Mission Title"
                        type="text"
                        onChange={handleUserInput}
                      />
                      <FormField
                        name="description"
                        label="Description"
                        type="text"
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
                        Generate Mission
                      </Button>
                      {formData.error && (
                        <p style={{ color: 'red' }}>{formData.error}</p>
                      )}
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

MissionMaker.getInitialProps = async ({ req, res }) => {
  isLoggedIn(req, res);
  return {};
};

export default MissionMaker;
