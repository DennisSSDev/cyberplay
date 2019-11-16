import { Express } from 'express';
import url from 'url';
import { IncomingMessage, ServerResponse } from 'http';

interface RouterInput {
    server: Express;
    nextHandler: (
        req: IncomingMessage,
        res: ServerResponse,
        parsedUrl?: url.UrlWithParsedQuery | undefined,
    ) => Promise<void>;
}

export const router = (input: RouterInput): void => {
    const { server, nextHandler } = input;

    server.get('/test', (_, res) => {
        return res.json({ ok: 'success' });
    });

    // Default catch-all renders Next app
    server.get('*', (req, res) => {
        // res.set({
        //   'Cache-Control': 'public, max-age=3600'
        // });
        const parsedUrl = url.parse(req.url, true);
        nextHandler(req, res, parsedUrl);
    });
};
