import mongoose, { Schema, Document } from 'mongoose';

/**
 * Data Model for storing missions.
 *
 * A mission is a piece of data that provides a roleplaying entry point.
 * It allows the users to start from somewhere when they group up.
 *
 * Missions are listed on job boards for users to pick up.
 * When a user signs up for a mission, they would also be displayed
 * in their dashboard page.
 */

mongoose.Promise = global.Promise;

export const convertId = mongoose.Types.ObjectId;

export interface MissionModelInterface extends Document {
  title: string; // the title of the mission
  description: string; // the full detail of the mission
  messages: [string]; // what did the users type while completing the mission
  createdAt: Date; // when was the mission created
}

/**
 * Simple callback function type definition
 */
export type cb = (...args: any[]) => void;

const schema = new Schema({
  title: {
    type: String,
    unique: true,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  messages: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const MissionSchema = mongoose.model<MissionModelInterface>(
  'Mission',
  schema,
);

export class MissionModel {
  /**
   * Retrieves the latest created missions
   * based on the specified amount.
   * Excludes the mission's message board.
   */
  static getLatestMissions = (amount: number, callback: cb) => {
    return MissionSchema.find()
      .sort({ _id: -1 })
      .limit(amount)
      .select('title description createdAt')
      .exec(callback);
  };

  /**
   * Returns the missions by the given ids
   * Excludes the mission's message board.
   */
  static getMissionsByIDs = (
    missionIDs: [mongoose.Types.ObjectId],
    callback: cb,
  ) => {
    return MissionSchema.find({
      _id: { $in: missionIDs },
    })
      .select('title description createdAt')
      .exec(callback);
  };

  /**
   * Retrieves a mission based on the provided id.
   */
  static getMissionByID = (missionID: string, callback: cb) => {
    const search = {
      _id: convertId(missionID),
    };
    return MissionSchema.findOne(search, callback);
  };

  /**
   * Adds a new message to the Mission message log (array)
   */
  static addMissionMessage = (
    message: string,
    missionID: string,
    callback: cb,
  ) => {
    MissionModel.getMissionByID(missionID, (err, doc) => {
      if (err) {
        return callback(err);
      }
      if (!doc) {
        return callback('document could not be found');
      }
      const { messages } = doc;
      if (!messages) {
        return callback('the messages parameter doesnt exist on this doc');
      }
      messages.push(message);
      const copy = doc;
      copy.messages = messages;
      return MissionSchema.updateOne({ _id: copy._id }, copy, error => {
        if (error) {
          return callback(error);
        }
        return callback();
      });
    });
  };
}

Object.seal(MissionModel);
