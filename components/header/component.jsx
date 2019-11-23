import React from 'react';
import { Header, Button, Link } from 'arwes';
import Router from 'next/router';
import { request } from './../../util';

const submitLogoutRequest = async () => {
  const res = await request('/logout');
  if (!res.ok) return;
  const json = await res.json();
  if (json.url) {
    Router.push(json.url);
  }
};

const VisualComponent = () => {
  return (
    <Header>
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
            <Button style={{ margin: 0, marginRight: 20, marginTop: 15 }}>
              Login
            </Button>
          </Link>
          <Link href="/signup">
            <Button style={{ margin: 0, marginTop: 15 }}>Sign up</Button>
          </Link>
        </div>
      </div>
    </Header>
  );
};

export const LoggedInHeaderComponent = () => {
  return (
    <Header>
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
          <Link href="/board">
            <Button style={{ margin: 0, marginRight: 20, marginTop: 15 }}>
              Quest Board
            </Button>
          </Link>
          <Link href="/settings">
            <Button style={{ margin: 0, marginRight: 20, marginTop: 15 }}>
              Settings
            </Button>
          </Link>
          <div>
            <Button
              layer="disabled"
              style={{ margin: 0, marginTop: 15 }}
              onClick={submitLogoutRequest}
            >
              Log Out
            </Button>
          </div>
        </div>
      </div>
    </Header>
  );
};

const HeaderComponent = VisualComponent;
export default HeaderComponent;
