import { Express } from 'express';
import url from 'url';
import { IncomingMessage, ServerResponse } from 'http';
import Server from 'next/dist/next-server/server/next-server';
import { isLoggedOutJSON, isLoggedInJSON, isLoggedIn } from './middleware';
import Account from './controllers/account';
import UserData from './controllers/userdata';
import Mission from './controllers/mission';

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
  const { server, nextHandler, app } = input;

  // backend get

  server.get('/logout', isLoggedInJSON, Account.logout);
  server.get('/token', Account.getToken);
  server.get('/userdata', isLoggedInJSON, UserData.getUserData);
  server.get('/missions', isLoggedInJSON, Mission.getLatesMissions);
  server.get('/missionsbyid', isLoggedInJSON, Mission.getMissionsByIDs);
  server.get('/mission', isLoggedInJSON, Mission.getMissionByID);

  // backend post

  server.post('/login', isLoggedOutJSON, Account.login);
  server.post('/signup', isLoggedOutJSON, Account.signup);
  server.post('/addmission', isLoggedInJSON, UserData.addMissionToUser);
  server.post('/makecreator', isLoggedInJSON, UserData.makeCreator);
  server.post('/makemission', isLoggedInJSON, Mission.makeMission);
  server.post('/addmessage', isLoggedInJSON, Mission.addMissionMessage);
  server.post('/changepass', isLoggedInJSON, Account.changePassword);

  // dynamic render request

  server.get('/dialog/:id', isLoggedIn, (req, res) => {
    const queryParams = { id: req.params.id };
    app.render(req, res, '/dialog', queryParams);
  });

  // Default catch-all renders Next app. It handles the rendering
  server.get('*', (req, res) => {
    // res.set({
    //   'Cache-Control': 'public, max-age=3600'
    // });
    const parsedUrl = url.parse(req.url, true);
    nextHandler(req, res, parsedUrl);
  });
};
