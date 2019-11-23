// index page that next.js will use
import React from 'react';
import {
  ThemeProvider,
  Arwes,
  createTheme,
  Frame,
  Image,
  Words,
  Button,
  Link,
  Appear,
  Line,
} from 'arwes';
import './static/index.css';
import { LoggedInHeaderComponent } from './../components/header/component';
import {
  isLoggedIn,
  useUserData,
  useLoaded,
  post,
  useCSRF,
  useUserMissions,
} from '../util';

const theme = createTheme({ animTime: 600 });

const imageMap = {
  Banshee: '/female1.jpg',
  Snapes: '/male1.jpg',
  Cross: '/female2.jpg',
  Shadow: '/male2.jpeg',
  Weebz: '/female3.jpeg',
  Connor: '/male3.jpeg',
};

const Dashboard = () => {
  const csrf = useCSRF();
  const data = useUserData();
  const loaded = useLoaded();
  const userMissions = useUserMissions();

  const activateCreatorMode = async () => {
    const res = await post('/makecreator', {}, csrf);
    if (!res.ok) return;
    // successfully made the user a creator
    location.reload();
  };

  return (
    <>
      {data.character && loaded && (
        <ThemeProvider theme={theme}>
          <Arwes animate background="/dashboard_back.jpeg">
            <div>
              <LoggedInHeaderComponent />
            </div>
            <div
              style={{
                marginTop: 20,
                marginLeft: 30,
                marginRight: 30,
              }}
            >
              <Frame level={2} corners={4}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                  }}
                >
                  <div style={{ padding: 20, maxWidth: 300 }}>
                    <Image animate resources={imageMap[data.character]} />
                  </div>
                  <div style={{ flexGrow: 1 }}>
                    <div style={{ alignSelf: 'center' }}>
                      <h2 style={{ textAlign: 'center' }}>
                        <Words
                          animate
                        >{`Welcome Back ${data.character}`}</Words>
                      </h2>
                    </div>
                    <div>
                      <h4>
                        <Words animate>Creator Status:</Words>

                        <Words
                          layer={data.isCreator ? 'success' : 'disabled'}
                          animate
                        >
                          {data.isCreator ? '_Active ' : '_Inactive'}
                        </Words>
                      </h4>
                    </div>
                    <div>
                      {(data.isCreator && (
                        <Link href="/missionmaker">
                          <Button animate layer="success">
                            Submit A Mission
                          </Button>
                        </Link>
                      )) || (
                        <Button animate onClick={activateCreatorMode}>
                          Activate Creator Mode
                        </Button>
                      )}
                    </div>
                    <div>
                      <h4>
                        <Words animate>Skills:</Words>

                        <Words
                          layer={data.isCreator ? 'success' : 'disabled'}
                          animate
                        >
                          {`_#pragma_: ${data.skills}`}
                        </Words>
                      </h4>
                    </div>
                    <div>
                      <h4>
                        <Words animate>Background:</Words>

                        <Words
                          layer={data.isCreator ? 'success' : 'disabled'}
                          animate
                        >
                          {`_#include_:  ${data.background}`}
                        </Words>
                      </h4>
                    </div>
                    <div>
                      <h4>
                        <Words animate>Motivation:</Words>

                        <Words
                          layer={data.isCreator ? 'success' : 'disabled'}
                          animate
                        >
                          {`_#interp_:  ${data.motivation}`}
                        </Words>
                      </h4>
                    </div>
                    <div style={{ alignSelf: 'center' }}>
                      <h2 style={{ textAlign: 'center' }}>
                        <Words animate>{`Active Missions`}</Words>
                      </h2>
                    </div>
                  </div>
                </div>
              </Frame>
              <div
                style={{
                  alignSelf: 'center',
                  display: 'flex',
                  marginTop: 20,
                  direction: 'row',
                }}
              >
                {(data.missions.length > 0 &&
                  userMissions &&
                  Object.keys(userMissions).map(v => {
                    const date = new Date(userMissions[v].createdAt);
                    const res = Math.abs(new Date() - date) / 1000;
                    let days = Math.floor(res / 86400);
                    days = days === 0 ? 1 : days;
                    return (
                      <div key={userMissions[v].title}>
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
                                <Words layer="disabled">Title:</Words>
                                <p>{userMissions[v].title}</p>
                              </div>
                              <Line animate />
                              <div
                                style={{
                                  maxWidth: 400,
                                }}
                              >
                                <Words layer="disabled">Description:</Words>
                                <p>{userMissions[v].description}</p>
                              </div>
                              <Line animate />
                              <div>
                                <Words layer="disabled">Created:</Words>
                                <p>{`${days} ${
                                  days > 1 ? 'days' : 'day'
                                } ago...`}</p>
                              </div>
                              <Line animate />
                              <div
                                style={{
                                  alignSelf: 'center',
                                }}
                              >
                                <Link href={`/dialog/${userMissions[v]._id}`}>
                                  <Button layer="success">Enter Dialog</Button>
                                </Link>
                              </div>
                            </div>
                          </Frame>
                        </Appear>
                      </div>
                    );
                  })) || (
                  <h3
                    style={{
                      textAlign: 'center',
                    }}
                  >
                    <Words animate layer="disabled">
                      No Signed up missions
                    </Words>
                  </h3>
                )}
              </div>
            </div>
          </Arwes>
        </ThemeProvider>
      )}
    </>
  );
};

Dashboard.getInitialProps = async ({ req, res }) => {
  isLoggedIn(req, res);

  return {};
};

export default Dashboard;
