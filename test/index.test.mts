/* eslint-disable sonarjs/assertions-in-tests */
import { describe, it } from 'node:test';
import request from 'supertest';
import express, { Application, NextFunction, Request, Response } from 'express';
import { acceptsJsonMiddleware } from '../src/index.mjs';

interface IStatus {
    status: number;
}

function buildServer(): Application {
    const app = express();
    app.disable('x-powered-by');
    return app.use(
        acceptsJsonMiddleware,
        (_req: Request, res: Response): unknown => res.json({ status: 200 }),
        (err: unknown, _req: Request, res: Response, _next: NextFunction): unknown =>
            res.status((err as IStatus).status).json(err),
    );
}

const server = buildServer();

await describe('acceptsJsonMiddleware', async () => {
    for (const [accepts, ok] of [
        [null, true],
        ['text/html', false],
        ['application/*', true],
        ['application/json', true],
        ['application/x-json', false],
        ['*/*', true],
        ['*/json', true],
        ['text/*', false],
        ['text/json', false],
        ['text/x-json', false],
        ['application/vnd.acme.account+json', false],
    ] as const) {
        // eslint-disable-next-line no-await-in-loop
        await it(`should handle case ${accepts} correctly`, async () => {
            let req = request(server).get('/');
            if (accepts !== null) {
                req = req.set('Accept', accepts);
            }

            await req.expect(ok ? 200 : 406);
        });
    }
});
