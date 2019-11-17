import isStringCheck from './../util/index';
import { Response, Request } from 'express';
import { AccountModel, AccountSchema } from '../models/account';

type func = (req: Request, res: Response) => void;

interface Account {
    getToken: func;
    login: func;
    signup: func;
    logout: func;
    changePassword: func;
    meta: func;
}

/**
 * Gets the CSRF token for forms
 */
const getToken = (req: Request, res: Response) => {
    const csrfTokenJSON = {
        csrfToken: req.csrfToken(),
    };
    res.json(csrfTokenJSON);
};

/**
 * validates whether the user can login
 */
const login = (req: Request, res: Response) => {
    const { username, pass } = req.body;

    if (!username || !pass) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    return AccountModel.authenticate(username, pass, (err, account) => {
        if (err || !account) {
            return res.status(401).json({ error: 'incorrect username or password' });
        }
        const reqC = req;
        if (reqC && reqC.session) {
            reqC.session.account = AccountModel.toAPI(account);
        }
        return res.json({ redirect: '/dashboard' });
    });
};

/**
 * processes the user's login credentials and determines if the user is valid or not
 */
const signup = (req: Request, res: Response) => {
    const { username, pass, pass2 } = req.body;
    try {
        isStringCheck(username, pass, pass2);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
    if (pass !== pass2) {
        return res.status(400).json({ error: `Passwords don't match` });
    }

    return AccountModel.genHash(pass, (salt, hash) => {
        const accountData = {
            username,
            salt,
            password: hash,
        };
        const newAccount = new AccountSchema(accountData);
        const savePromise = newAccount.save();
        savePromise.then(() => {
            const reqC = req;
            if (reqC && reqC.session) {
                reqC.session.account = AccountModel.toAPI(newAccount);
            }
            res.json({ redirect: '/dashboard' });
        });
        savePromise.catch(err => {
            if (err.code === 11000) {
                return res.status(400).json({ error: 'Username already used' });
            }
            return res.status(400).json({ error: 'an error occured' });
        });
    });
};

/**
 * kills the user's session and returns him into a public session
 */
const logout = (req: Request, res: Response) => {
    try {
        if (req.session) {
            req.session.destroy(() => {});
            res.json({ result: 'session disconnected' });
            return;
        }
        throw new Error('there is no active session');
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

/**
 * handles the process of changing the user's password
 * if the old password matches the current password and the entered new password (twice) match, update happens
 */
const changePassword = (req: Request, res: Response) => {
    if (!req.session || !req.session.account) {
        return res.status(400).json({ error: 'there is no active session' });
    }
    const { oldpass, pass, pass2 } = req.body;
    try {
        isStringCheck(oldpass, pass, pass2);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
    if (pass !== pass2) {
        return res.status(400).json({ error: 'passwords do not match' });
    }
    if (oldpass === '') {
        return res.status(400).json({ error: 'your old password is invalid' });
    }
    return AccountModel.updateUserPassword(req.session.account._id, oldpass, pass, err => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        return res.json({ result: 'user password updated' });
    });
};

const meta = (req: Request, res: Response) => {
    if (!req.session || !req.session.account) {
        return res.status(400).json({ error: 'there is no active session' });
    }
    return AccountModel.getUserMetaInfo(req.session.account._id, (err, doc) => {
        if (err) {
            return res.status(400).json({ error: err });
        }
        return res.json(doc);
    });
};

const Account: Account = {
    getToken,
    login,
    signup,
    logout,
    changePassword,
    meta,
};

export default Account;
