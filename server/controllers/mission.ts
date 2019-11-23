import { Response, Request } from 'express';
import isStringCheck, { isValidSession } from '../util';
import { MissionModel, MissionSchema } from '../models/mission';
import { UserDataModel } from '../models/userdata';

type func = (req: Request, res: Response) => void;

interface Mission {
  // retrieves the latest missions
  getLatesMissions: func; // GET
  // gets all the missions by the provided mission IDs
  getMissionsByIDs: func; // GET
  // gets 1 mission by the provided mission ID
  getMissionByID: func; // GET
  // creates a new mission. Only creators can do this
  makeMission: func; // MAKE
  addMissionMessage: func;
}

/**
 * gets the latest missions.
 * Latest is defined arbitrarily
 */
const getLatesMissions = (req: Request, res: Response) => {
  if (!isValidSession(req.session, res) || !req.session) {
    return res.status(400).json({ error: 'not a valid session' });
  }
  MissionModel.getLatestMissions(10, (err, docs) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    return res.json(docs);
  });
};

/**
 * gets all the missions by the provided mission IDs
 */
const getMissionsByIDs = (req: Request, res: Response) => {
  if (!isValidSession(req.session, res) || !req.session) {
    return res.status(400).json({ error: 'not a valid session' });
  }
  const { _id } = req.session.account;
  UserDataModel.findUserDataByOwnerID(_id, (err, doc) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    if (!doc) {
      return res
        .status(400)
        .json({ error: 'Document for user data is invalid' });
    }
    MissionModel.getMissionsByIDs(doc.missions, (error, docs) => {
      if (error) {
        return res.status(400).json({ error: error });
      }
      if (!doc) {
        return res
          .status(400)
          .json({ error: 'Document for user data is invalid' });
      }
      return res.json(docs);
    });
  });
};

/**
 * gets 1 mission by the provided mission ID
 */
const getMissionByID = (req: Request, res: Response) => {
  if (!isValidSession(req.session, res) || !req.session) {
    return res.status(400).json({ error: 'not a valid session' });
  }
  const { id } = req.query;
  if (!id || isStringCheck(id)) {
    return res.status(400).json({ error: 'not a valid mission id' });
  }
  MissionModel.getMissionByID(id, (err, doc) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    if (!doc) {
      return res
        .status(400)
        .json({ error: 'Document for user data is invalid' });
    }
    return res.json(doc);
  });
};

/**
 * creates a new mission. Only creators can do this
 */
const makeMission = (req: Request, res: Response) => {
  if (!isValidSession(req.session, res) || !req.session) {
    return res.status(400).json({ error: 'not a valid session' });
  }
  const { title, description } = req.body;
  try {
    isStringCheck(title, description);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
  const missionData = { title, description };
  const newMission = new MissionSchema(missionData);
  newMission
    .save()
    .then(() => {
      return res.json({ result: 'ok' });
    })
    .catch(err => {
      return res.status(400).json({ error: err });
    });
};

const addMissionMessage = (req: Request, res: Response) => {
  if (!isValidSession(req.session, res) || !req.session) {
    return res.status(400).json({ error: 'not a valid session' });
  }
  const { message, missionID } = req.body;
  try {
    isStringCheck(message, missionID);
  } catch (err) {
    res.status(400).json({ error: err });
    return;
  }
  MissionModel.addMissionMessage(message, missionID, err => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    return res.json({ result: 'ok' });
  });
};

const Mission: Mission = {
  getLatesMissions,
  getMissionByID,
  getMissionsByIDs,
  makeMission,
  addMissionMessage,
};

export default Mission;
