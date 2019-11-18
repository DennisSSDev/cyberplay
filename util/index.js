import { useEffect, useState } from 'react';
import fetch from 'isomorphic-unfetch';

// todo: change for deployment
const fetchURL = 'http://localhost:3000';

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
        console.log(json);
        setCSRF(json.csrfToken);
    };
    useEffect(() => {
        getCSRF();
    }, []);
    return csrf;
};

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

export const postNoData = endpoint => {
    return fetch(`${fetchURL}${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
    });
};
