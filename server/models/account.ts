import crypto from 'crypto';
import mongoose, { Schema, Document } from 'mongoose';

/**
 * Account is responsible for storing all data related to
 * user login + generating hashes for passwords
 */

mongoose.Promise = global.Promise;
const convertId = mongoose.Types.ObjectId;

const iterations = 10000;
const saltLength = 64;
const keyLength = 64;

export interface AccountModelInterface extends Document {
    username: string;
    salt: Buffer;
    password: string;
    createdAt: Date;
}

/**
 * Simple callback function type definition
 */
export type cb = (...args: any[]) => void;

// check that the given password is valid
const validatePassword = (doc: AccountModelInterface, password: string, callback: cb) => {
    const pass = doc.password;
    return crypto.pbkdf2(password, doc.salt, iterations, keyLength, 'RSA-SHA512', (_, hash) => {
        if (hash.toString('hex') !== pass) {
            return callback(false);
        }
        return callback(true);
    });
};

const schema = new Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        match: /^[a-zA-Z0-9]([._](?![._])|[a-zA-Z0-9]){6,18}[a-zA-Z0-9]$/,
    },
    salt: {
        type: Buffer,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const AccountSchema = mongoose.model<AccountModelInterface>('Account', schema);

export class AccountModel {
    // find user by the specified username
    static findByUsername = (name: string, callback: cb) => {
        const search = {
            username: name,
        };
        return AccountSchema.findOne(search, callback);
    };

    // generate password hash that will be stored in the db
    static genHash = (password: string, callback: cb) => {
        const salt = crypto.randomBytes(saltLength);

        crypto.pbkdf2(password, salt, iterations, keyLength, 'RSA-SHA512', (_, hash) =>
            callback(salt, hash.toString('hex')),
        );
    };

    // convert document data and give it back to the current user session
    static toAPI = (doc: AccountModelInterface) => ({
        username: doc.username,
        _id: doc._id,
    });

    static updateUserPassword = (id: string, oldPassword: string, newPassword: string, callback: cb) => {
        const userID = convertId(id);
        AccountSchema.findById(userID, (err, doc) => {
            if (err) {
                return callback(err);
            }
            if (!doc) {
                return callback(new Error('Document was not found'));
            }
            return validatePassword(doc, oldPassword, result => {
                if (result !== true) {
                    return callback(new Error('Old Password is invalid'));
                }
                return AccountModel.genHash(newPassword, (salt, hash) => {
                    return AccountSchema.updateOne({ username: doc.username }, { salt, password: hash }, callback);
                });
            });
        });
    };

    // grabs user meta data such as username and creation date
    static getUserMetaInfo = (id: string, callback: cb) => {
        const _id = convertId(id);

        return AccountSchema.findById(_id)
            .select('username createdAt')
            .exec(callback);
    };

    // call to make sure that the supplied data is from a valid user
    static authenticate = (username: string, password: string, callback: cb) =>
        AccountModel.findByUsername(username, (err, doc) => {
            if (err) {
                return callback(err);
            }

            if (!doc) {
                return callback();
            }

            return validatePassword(doc, password, result => {
                if (result === true) {
                    return callback(null, doc);
                }

                return callback();
            });
        });
}

Object.seal(AccountModel);
