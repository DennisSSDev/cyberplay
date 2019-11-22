import { Response } from 'express';

/**
 * Helper to detect whether the arguments supplied are actually strings.
 * Throws errors in case a none string value is detected
 * @param args anything
 */
const isStringCheck = (...args: any[]) => {
    args.forEach(value => {
        if (typeof value !== 'undefined') {
            if (typeof value !== 'string') {
                throw new Error('provided parameter is not a string');
            }
        } else {
            throw new Error('provided parameter is undefined');
        }
    });
};

/**
 * iteration of the isTringCheck helper. accepts an array
 * @param args array of anything
 */
export const isStringCheckArray = (args: any[]) => {
    if (args.length > 0) {
        args.forEach(value => {
            if (typeof value !== 'undefined') {
                if (typeof value !== 'string') {
                    throw new Error('provided parameter is not a string');
                }
            } else {
                throw new Error('provided parameter is undefined');
            }
        });
    }
};

export const isValidSession = (session: any, res: Response) => {
    if (!session || !session.account) {
        res.status(400).json({ error: 'no valid session' });
        return false;
    }
    return true;
};

export default isStringCheck;
