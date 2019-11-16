import redis from 'redis'; // pull in the redis module
import { UrlWithStringQuery } from 'url';

let redisClient: redis.RedisClient; // variable to hold redis connection that we can pass to other parts of code

// function to connect with the redisURL and redisPASS
export const utilConnectRedis = (redisURL: UrlWithStringQuery, redisPASS: string): void => {
    // create a new redis client for the port and hostname/address
    const redisPort = (redisURL.port as unknown) as number;
    redisClient = redis.createClient(redisPort, redisURL.hostname);

    // if there is a password, (normally means not running locally)
    if (redisPASS) {
        redisClient.auth(redisPASS); // authenticate using the password
    }

    // Asynchronous event handlers for redis

    // when connected successfully
    redisClient.on('connect', () => {
        console.log('redis connected');
    });

    // if there is an error
    redisClient.on('error', err => {
        console.log('could not connect');
        throw err;
    });

    // if the redis connection is lost or closed
    redisClient.on('end', err => {
        console.dir(err);
        console.log('disconnected from redis');
    });
};

export const getRedisClient = (): redis.RedisClient => redisClient;
