import express from 'express';
import next from 'next';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare()
    .then((): void => {
        const server = express();

        server.get('/test', (_, res): void => {
            res.json({ ok: 'it works' });
        });

        server.get(
            '*',
            (req, res): Promise<void> => {
                return handle(req, res);
            },
        );

        server.listen(3000, (err): void => {
            if (err) throw err;
            console.log('> Ready on http://localhost:3000');
        });
    })
    .catch((ex): void => {
        console.error(ex.stack);
        process.exit(1);
    });
