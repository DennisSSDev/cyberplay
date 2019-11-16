import { Request, Response, NextFunction } from 'express';

interface ResponseError extends Error {
    status?: number;
    code?: string;
}

export const csrfCheck = (err: ResponseError, _: Request, __: Response, next: NextFunction): boolean => {
    if (err.code !== 'EBADCSRFTOKEN') {
        next(err);
        return true;
    }
    console.log('Missing CSRF token');
    return false;
};

/**
 * detects whether the request is coming from a user that is logged out.
 * if the user is logged out, continue the request process
 * otherwise reroute to dashboard
 */
export const isLoggedOut = (req: Request, res: Response, next: NextFunction): void => {
    if (!req.session || !req.session.account) {
        return next();
    }
    res.redirect('/dashboard');
    return;
};

/**
 * check for whether the user is logged in
 */
export const isLoggedIn = (req: Request, res: Response, next: NextFunction): void => {
    if (req.session && req.session.account) {
        return next();
    }
    res.redirect('/login');
    return;
};

/**
 * authentication check
 * if the user doesn't have a valid session, redirect them to the login
 */
export const auth = (req: Request, res: Response): void => {
    if (req.session && req.session.account) {
        res.json({ redirect: '' });
        return;
    }
    res.json({ redirect: '/login' });
    return;
};

/**
 * detect if this is a public session (i.e, no session)
 * if this is not a public session, redirect user to the dashboard
 */
export const pub = (req: Request, res: Response): void => {
    if (!req.session || !req.session.account) {
        res.json({ redirect: '' });
        return;
    }
    res.json({ redirect: '/dashboard' });
    return;
};

export const enforceSSL = (req: Request, res: Response, next: NextFunction): void => {
    const proto = req.headers['x-forwarded-proto'];
    if (proto === 'https') {
        res.set({
            'Strict-Transport-Security': 'max-age=31557600', // one-year
        });
        return next();
    }
    res.redirect('https://' + req.headers.host + req.url);
};
