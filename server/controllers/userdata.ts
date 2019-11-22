import { Response, Request } from 'express';
import { UserDataModel, UserDataSchema } from '../models/userdata';
import isStringCheck, { isValidSession } from '../util';

type func = (req: Request, res: Response) => void;

interface UserData {
    // retrieve all available user data
    getUserData: (req: Request, res: Response) => {}; // GET
    // adds a new mission to the user
    addMissionToUser: func; // UPDATE
    // check if the user is a creator
    isCreator: func; // GET
    // set the specified user as the creator
    makeCreator: func; // UPDATE
    // makes a brand new document entry for the user data
    // DO NOT use for an end point. Used along with creation of an account
    makeUserData: (req: Request, res: Response, userData: {}) => void; // CREATE
}

/**
 * retrieve the user meta data based on the id
 */
const getUserData = (req: Request, res: Response) => {
    if (!isValidSession(req.session, res) || !req.session) {
        return {};
    }
    return UserDataModel.findUserDataByOwnerID(req.session.account._id, (err, doc) => {
        if (err) {
            return {};
        }
        return doc;
    });
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
 * Check if the user has been marked as a creator
 * aka, can the user create stories
 */
const isCreator = (req: Request, res: Response) => {
    if (!isValidSession(req.session, res) || !req.session) {
        return;
    }
    const { _id } = req.session.account;
    UserDataModel.isUserACreator(_id, (err, status) => {
        if (err) {
            return res.status(400).json({ error: err });
        }
        return res.json({ result: status });
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

/**
 *  this function is presumably called with the account creation,
 *  so don't use it for an endpoint
 */
const makeUserData = (_: Request, res: Response, userData: {}) => {
    const newUserData = new UserDataSchema(userData);
    const savePromise = newUserData.save();
    savePromise.then(() => {
        return res.json({ redirect: '/dashboard' });
    });
    savePromise.catch(err => {
        return res.status(400).json({ error: err });
    });
};

const UserData: UserData = {
    getUserData,
    addMissionToUser,
    isCreator,
    makeCreator,
    makeUserData,
};

export default UserData;
