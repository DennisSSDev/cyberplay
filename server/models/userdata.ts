import mongoose, { Schema, Document } from 'mongoose';

/**
 * Data Model that stores user's meta data
 * meta data includes the playing character, i.e
 * player avatar, description, past, skills, etc.
 *
 * it also stores info on whether the user is a creator.
 * Creators are users that have access to the creation of a new mission
 *
 * Missions that the user signed up for are also stored here
 * This data is also referenced by the account and can be accessed if the
 * user has the appropriate owner id
 */

mongoose.Promise = global.Promise;
const convertId = mongoose.Types.ObjectId;

export interface UserDataModelInterface extends Document {
  background: string; // the character's past history
  skills: string; // what is the character good at
  motivation: string; // what's driving the character
  character: string; // the name of the avatar
  isCreator: boolean; // can the user create new missions?
  missions: [mongoose.Types.ObjectId]; // the missions the user signed up for
  owner: mongoose.Types.ObjectId; // the user that owns this data
}

/**
 * Simple callback function type definition
 */
export type cb = (...args: any[]) => void;

const schema = new Schema({
  background: {
    type: String,
    required: true,
  },
  skills: {
    type: String,
    required: true,
  },
  motivation: {
    type: String,
    required: true,
  },
  character: {
    type: String,
    required: true,
  },
  isCreator: {
    type: Boolean,
    default: false,
  },
  missions: {
    type: [mongoose.Types.ObjectId],
    default: [],
  },
  owner: {
    type: mongoose.Types.ObjectId,
    unique: true,
    required: true,
    ref: 'Account',
  },
});

export const UserDataSchema = mongoose.model<UserDataModelInterface>(
  'UserData',
  schema,
);

export class UserDataModel {
  // returns the first user's meta data based on the doc owner id
  static findUserDataByOwnerID = (ownerID: string, callback: cb) => {
    const search = {
      owner: convertId(ownerID),
    };
    return UserDataSchema.findOne(search, callback);
  };

  /**
   * makes the specified owner of the data a creator
   * aka allowing them to create new missions
   */
  static makeCreatorByOwnerID = (ownerID: string, callback: cb) => {
    const search = {
      owner: convertId(ownerID),
    };
    return UserDataSchema.updateOne(
      search,
      { isCreator: true },
      { upsert: false },
      callback,
    );
  };

  /**
   * "Signs up" the user for a new mission
   */
  static addMissionByOwnerID = (
    ownerID: string,
    missionID: string,
    callback: cb,
  ) => {
    UserDataModel.findUserDataByOwnerID(ownerID, (err, doc) => {
      if (err) {
        return callback(err);
      }
      if (!doc) {
        return callback('document was not found');
      }
      const { missions } = doc;
      const misID = convertId(missionID);
      if (!missions || missions.includes(misID)) {
        return callback(
          'the missions array is invalid or it already includes the supplied mission ID',
        );
      }
      missions.push(misID);
      const copy = doc;
      copy.missions = missions;
      return UserDataSchema.updateOne({ owner: ownerID }, copy, error => {
        if (error) {
          return callback(error);
        }
        return callback();
      });
    });
  };
}

Object.seal(UserDataModel);
