// index page that next.js will use
import React from 'react';
import {
  ThemeProvider,
  createTheme,
  Arwes,
  Frame,
  Appear,
  Button,
  Line,
  Words,
} from 'arwes';
import './static/index.css';
import { LoggedInHeaderComponent } from './../components/header/component';
import {
  useCSRF,
  isLoggedIn,
  useLatestMissions,
  useUserData,
  post,
} from '../util';

const theme = createTheme({ animTime: 500 });

const Board = () => {
  const csrf = useCSRF();

  const latestMissions = useLatestMissions();
  const userData = useUserData();

  const generateAcceptMissionRequest = id => {
    return async () => {
      const res = await post('/addmission', { missionID: id }, csrf);
      if (!res.ok) return;
      // the mission addition executed correctly -> return to dashboard
      Router.push('/dashboard');
    };
  };

  return (
    <>
      {csrf && latestMissions && userData && userData.missions && (
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
              }}
            >
              <Frame style={{ marginBottom: 20, textAlign: 'center' }}>
                <h1>Mission Board</h1>
              </Frame>
              <Frame style={{ marginBottom: 10, textAlign: 'center' }}>
                <h3>Find and select a task you would like to undertake</h3>
              </Frame>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                {Object.keys(latestMissions).length > 0 &&
                  Object.keys(latestMissions).map(v => {
                    const date = new Date(latestMissions[v].createdAt);
                    const res = Math.abs(new Date() - date) / 1000;
                    let days = Math.floor(res / 86400);
                    days = days === 0 ? 1 : days;
                    if (userData.missions.includes(latestMissions[v]._id)) {
                      return null;
                    }
                    return (
                      <div key={latestMissions[v].title}>
                        <Appear>
                          <Frame level={2} corners={5}>
                            <div
                              style={{
                                margin: 10,
                                display: 'flex',
                                flexDirection: 'column',
                              }}
                            >
                              <div>
                                <Words layer="success">Title:</Words>
                                <p>{latestMissions[v].title}</p>
                              </div>
                              <Line animate />
                              <div style={{ maxWidth: 400 }}>
                                <Words layer="success">Description:</Words>
                                <p>{latestMissions[v].description}</p>
                              </div>
                              <Line animate />
                              <div>
                                <Words layer="success">Created:</Words>
                                <p>{`${days} ${
                                  days > 1 ? 'days' : 'day'
                                } ago...`}</p>
                              </div>
                              <Line animate />
                              <div style={{ alignSelf: 'center' }}>
                                <Button
                                  onClick={generateAcceptMissionRequest(
                                    latestMissions[v]._id,
                                  )}
                                >
                                  Accept Mission
                                </Button>
                              </div>
                            </div>
                          </Frame>
                        </Appear>
                      </div>
                    );
                  })}
              </div>
            </div>
          </Arwes>
        </ThemeProvider>
      )}
    </>
  );
};

Board.getInitialProps = async ({ req, res }) => {
  isLoggedIn(req, res);
  return {};
};

export default Board;
