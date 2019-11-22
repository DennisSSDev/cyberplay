import { Express } from 'express';
import url from 'url';
import { IncomingMessage, ServerResponse } from 'http';
import Server from 'next/dist/next-server/server/next-server';
import { isLoggedOutJSON, isLoggedInJSON } from './middleware';
import Account from './controllers/account';
import UserData from './controllers/userdata';

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

    server.get('/logout', isLoggedInJSON, Account.logout);
    server.get('/token', Account.getToken);
    server.get('/isCreator', isLoggedInJSON, UserData.isCreator);
    server.get('/userdata', isLoggedInJSON, UserData.getUserData);

    // backend post

    server.post('/login', isLoggedOutJSON, Account.login);
    server.post('/signup', isLoggedOutJSON, Account.signup);
    server.post('/addmission', isLoggedInJSON, UserData.addMissionToUser);
    server.post('/makecreator', isLoggedInJSON, UserData.makeCreator);

    // Default catch-all renders Next app. It handles teh rendering
    server.get('*', (req, res) => {
        // res.set({
        //   'Cache-Control': 'public, max-age=3600'
        // });
        const parsedUrl = url.parse(req.url, true);
        nextHandler(req, res, parsedUrl);
    });
};
