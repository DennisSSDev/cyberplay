import { Response, Request } from 'express';
import { UserDataModel } from '../models/userdata';
import isStringCheck, { isValidSession } from '../util';

type func = (req: Request, res: Response) => void;

interface UserData {
  // retrieve all available user data
  getUserData: (req: Request, res: Response) => void; // GET
  // adds a new mission to the user
  addMissionToUser: func; // UPDATE
  // set the specified user as the creator
  makeCreator: func; // UPDATE
}

/**
 * retrieve the user meta data based on the id
 */
const getUserData = (req: Request, res: Response) => {
  if (!isValidSession(req.session, res) || !req.session) {
    return res.status(400).json({ error: 'not a valid session' });
  }
  return UserDataModel.findUserDataByOwnerID(
    req.session.account._id,
    (err, doc) => {
      if (err) {
        return res.status(400).json({ error: err });
      }
      return res.json(doc);
    },
  );
};

/**
 * update or create the user data based on the supplied form info
 */
const addMissionToUser = (req: Request, res: Response) => {
  const { missionID } = req.body;
  try {
    isStringCheck(missionID);
  } catch (err) {
    res.status(400).json({ error: err });
    return;
  }
  if (!isValidSession(req.session, res) || !req.session) {
    return;
  }
  const { _id } = req.session.account;
  UserDataModel.addMissionByOwnerID(_id, missionID, err => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    return res.json({ result: 'data updated' });
  });
};

/**
 * Convert user into a creator
 */
const makeCreator = (req: Request, res: Response) => {
  if (!isValidSession(req.session, res) || !req.session) {
    return;
  }
  const { _id } = req.session.account;
  UserDataModel.makeCreatorByOwnerID(_id, err => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    return res.json({ result: 'ok' });
  });
};

const UserData: UserData = {
  getUserData,
  addMissionToUser,
  makeCreator,
};

export default UserData;
