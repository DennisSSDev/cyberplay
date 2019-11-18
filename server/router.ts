import { Express } from 'express';
import url from 'url';
import { IncomingMessage, ServerResponse } from 'http';
import Server from 'next/dist/next-server/server/next-server';
import { isLoggedOut, isLoggedIn } from './middleware';
import Account from './controllers/account';

interface RouterInput {
    server: Express;
    app: Server;
    nextHandler: (
        req: IncomingMessage,
        res: ServerResponse,
        parsedUrl?: url.UrlWithParsedQuery | undefined,
    ) => Promise<void>;
}

export const router = (input: RouterInput): void => {
    const { server, nextHandler } = input;

    // backend get

    server.get('/logout', isLoggedIn, Account.logout);
    server.get('/token', Account.getToken);

    // backend post

    server.post('/login', isLoggedOut, Account.login);
    server.post('/signup', isLoggedOut, Account.signup);

    server.get('/dashboard', (req, res) => {
        input.app.render(req, res, '/dashboard');
    });

    // Default catch-all renders Next app
    server.get('*', (req, res) => {
        // res.set({
        //   'Cache-Control': 'public, max-age=3600'
        // });
        const parsedUrl = url.parse(req.url, true);
        nextHandler(req, res, parsedUrl);
    });
};
