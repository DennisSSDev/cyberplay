import { useEffect, useState } from 'react';
import fetch from 'isomorphic-unfetch';

const fetchURL =
  process.env.NODE_ENV === 'production'
    ? `https://cyber-play.herokuapp.com`
    : 'http://localhost:3000';

/**
 * A syncronization effect that is used for react components that
 * do not fetch data on mounting.
 * This is done to allow the jss to sync for SSR
 */
export const useLoaded = () => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => setLoaded(true), []);
  return loaded;
};

/**
 * Middleware to streamline the GET request
 * @param {*} from endpoint
 */
export const request = from =>
  fetch(`${fetchURL}${from}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

/**
 * Middleware to allow the React component to ask
 * for a csrf token
 */
export const useCSRF = () => {
  const [csrf, setCSRF] = useState('');
  const getCSRF = async () => {
    const res = await request('/token');
    const json = await res.json();
    setCSRF(json.csrfToken);
  };
  useEffect(() => {
    getCSRF();
  }, []);
  return csrf;
};

/**
 * Mount for react components requiring the
 * logged in user data
 */
export const useUserData = () => {
  const [data, setUserData] = useState({});
  const getData = async () => {
    const res = await request('/userdata');
    const json = await res.json();
    setUserData(json);
  };
  useEffect(() => {
    getData();
  }, []);
  return data;
};

/**
 * Mount for components that require
 * the latest published missions on the server
 */
export const useLatestMissions = () => {
  const [missions, setMissions] = useState({});
  const getMissions = async () => {
    const res = await request('/missions');
    const json = await res.json();
    setMissions(json);
  };
  useEffect(() => {
    getMissions();
  }, []);
  return missions;
};

/**
 * Mount for components that require missions
 * that the logged in user signed up for
 */
export const useUserMissions = () => {
  const [missionsData, setMissions] = useState({});
  const getMissions = async () => {
    const res = await request('/missionsbyid');
    const json = await res.json();
    setMissions(json);
  };
  useEffect(() => {
    getMissions();
  }, []);
  return missionsData;
};

/**
 * Middleware to streamline the POST request process
 * @param {*} endpoint
 * @param {*} data JSON data to be sent to the endpoint
 * @param {*} csrfToken
 * you will most likely need a useCSRF if you intend to make a post request
 */
export const post = (endpoint, data, csrfToken) => {
  return fetch(`${fetchURL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'CSRF-token': csrfToken,
    },
    body: JSON.stringify(data),
  });
};

/**
 * detects whether the request is coming from a user that is logged out.
 * if the user is logged out, continue the request process
 * otherwise reroute to dashboard
 */
export const isLoggedOut = (req, res) => {
  if (req && req.session && req.session.account) {
    res.redirect('/dashboard');
    res.end();
  }
};

/**
 * check for whether the user is logged in
 */
export const isLoggedIn = (req, res) => {
  if (req && (!req.session || !req.session.account)) {
    res.redirect('/login');
    res.end();
  }
};
