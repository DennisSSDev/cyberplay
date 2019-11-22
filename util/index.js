import { useEffect, useState } from 'react';
import fetch from 'isomorphic-unfetch';

const fetchURL = process.env.NODE_ENV === 'production' ? `https://${window.location.host}` : 'http://localhost:3000';

export const useLoaded = () => {
    const [loaded, setLoaded] = useState(false);
    useEffect(() => setLoaded(true), []);
    return loaded;
};

export const request = from =>
    fetch(`${fetchURL}${from}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
    });

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

/*
export const useAuth = () => {
    const [auth, setAuth] = useState(false);
    const getAuth = async () => {
        const res = await request('/auth');
        const json = await res.json();
        setAuth(json.login);
    };
    useEffect(() => {
        getAuth();
    }, []);
    return auth;
};*/

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
