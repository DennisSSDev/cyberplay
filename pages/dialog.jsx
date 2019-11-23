import React, { useState, useEffect } from 'react';
import {
  ThemeProvider,
  createTheme,
  Arwes,
  Frame,
  Button,
  Blockquote,
} from 'arwes';
import { Form, FormField, Grommet, Box } from 'grommet';
import './static/index.css';
import { LoggedInHeaderComponent } from './../components/header/component';
import { post, useCSRF, isLoggedIn, request } from '../util';
import { PropTypes } from 'prop-types';

const theme = createTheme({ animTime: 500 });

const Dialog = props => {
  const [formData, setFormData] = React.useState({});
  const csrf = useCSRF();

  const [mission, setMission] = useState({});
  const getMission = async () => {
    const resp = await request(`/mission?id=${props.id}`);
    if (!res.ok) {
      const json = await res.json();
      setFormData({ ...formData, error: json.error });
      return;
    }
    const json = await resp.json();
    setMission(json);
    document.querySelector('#bottom').scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    const interval = setInterval(() => {
      getMission();
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleUserInput = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value, error: '' });
  };

  const submitFormData = async () => {
    const { input } = formData;
    document.querySelector('#formF').reset();
    if (!input) {
      return;
    }
    const res = await post(
      '/addmessage',
      { message: input, missionID: props.id },
      csrf,
    );
    if (!res.ok) {
      const json = await res.json();
      setFormData({ ...formData, error: json.error });
      return;
    }
    getMission();
  };
  return (
    <>
      {csrf && (
        <ThemeProvider theme={theme}>
          <Arwes animate background="/login_back.jpeg">
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
                overflow: 'hidden',
              }}
            >
              <Frame style={{ marginBottom: 20, textAlign: 'center' }}>
                <h1>{`Mission Dialog: ${
                  mission.title ? mission.title : 'loading...'
                }`}</h1>
              </Frame>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {(mission &&
                  mission.messages &&
                  mission.messages.length > 0 &&
                  mission.messages.map((v, index) => (
                    <div key={`${v}${index}`}>
                      <Blockquote>
                        <p>{v}</p>
                      </Blockquote>
                    </div>
                  ))) || (
                  <Blockquote>
                    <div style={{ margin: 10 }}>
                      <p>No Messages have been sent yet from any party</p>
                    </div>
                  </Blockquote>
                )}
              </div>
              <div style={{ marginTop: 110, marginBottom: 110 }} id="bottom" />
            </div>
            <div
              style={{
                position: 'fixed',
                bottom: 0,
                width: '100%',
                overflow: 'hidden',
              }}
            >
              <Frame level={1} corners={4} style={{ margin: 10 }}>
                <Grommet
                  theme={{
                    formField: {
                      border: { color: '#029CBB', size: 'small' },
                    },
                    radioButton: {
                      border: { width: '2px', color: '#029CBB' },
                    },
                  }}
                >
                  <Form id="formF">
                    <Box width="medium" flex fill>
                      <FormField
                        name="input"
                        placeholder="Enter CyberMessage"
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
                        Send Response
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

Dialog.propTypes = {
  id: PropTypes.string,
};

Dialog.getInitialProps = async ({ req, res, query }) => {
  isLoggedIn(req, res);
  return query;
};

export default Dialog;
