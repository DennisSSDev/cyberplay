import { enforceSSL, csrfCheck } from './middleware';
import compression from 'compression';
import favicon from 'serve-favicon';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import mongoose, { ConnectionOptions } from 'mongoose';
import expsession from 'express-session';
import connectRedis from 'connect-redis';
import csrf from 'csurf';
import { router } from './router';
import { utilConnectRedis } from './redis';
import express from 'express';
import next from 'next';
import path from 'path';
import url, { UrlWithStringQuery } from 'url';
import cluster from 'cluster';
import os from 'os';

const numCPUs = os.cpus().length;

// detect if in production
const dev = process.env.NODE_ENV !== 'production';
// grab a valid port based on the environment
const port = process.env.PORT || process.env.NODE_PORT || 3000;

/////////////// MONGO ///////////////////
const dbURL = process.env.MONGODB_URI || 'mongodb://localhost/CyberPlayLocal';
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true } as ConnectionOptions, err => {
    if (err) {
        console.log('unable to init the mongo db');
        throw err;
    }
});
////////////////////////////////////////

////////////// REDIS //////////////////
const RedisStore = connectRedis(expsession);
let redisURL: UrlWithStringQuery = {
    hostname: 'redis-17436.c84.us-east-1-2.ec2.cloud.redislabs.com',
    port: '17436',
    query: '',
};
let redisPASS = 'Nx1R0REyrFlJYTdaGhwzxRC31uI6EUai';
if (process.env.REDISCLOUD_URL) {
    redisURL = url.parse(process.env.REDISCLOUD_URL);
    if (redisURL.auth) {
        const [, el] = redisURL.auth.split(':');
        redisPASS = el;
    }
}
utilConnectRedis(redisURL, redisPASS);
/////////////////////////////////////////

// Multi-process to utilize all CPU cores.
if (!dev && cluster.isMaster) {
    console.log(`Node cluster master ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.error(`Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`);
    });
} else {
    const nextApp = next({ dir: '.', dev });
    const nextHandler = nextApp.getRequestHandler();

    nextApp.prepare().then(() => {
        const server = express();
        server.disable('x-powered-by');
        server.use(compression());
        server.use(
            bodyParser.urlencoded({
                extended: true,
            }),
        );
        server.use(bodyParser.json());

        // init redis
        const redisPort = (redisURL.port as unknown) as number;
        server.use(
            expsession({
                store: new RedisStore({
                    host: redisURL.hostname,
                    port: redisPort,
                    pass: redisPASS,
                }),
                secret: 'Not Artigato SSL',
                resave: true,
                saveUninitialized: true,
                cookie: {
                    httpOnly: true,
                },
            }),
        );

        // cookies & csrf
        server.use(cookieParser());
        server.use(csrf());
        server.use(csrfCheck);

        if (!dev) {
            // Enforce SSL & HSTS in production
            server.use(enforceSSL);
        }

        // Static files
        // https://github.com/zeit/next.js/tree/4.2.3#user-content-static-file-serving-eg-images
        server.use(
            '/public',
            express.static(path.join(__dirname, 'public'), {
                maxAge: dev ? '0' : '365d',
            }),
        );

        server.use(favicon('public/favicon.ico'));

        router({ server, nextHandler, app: nextApp });

        server.listen(port, () => {
            console.log(`Listening on port: ${port}`);
        });
    });
}
