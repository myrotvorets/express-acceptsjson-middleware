import request from 'supertest';
import express, { Application, NextFunction, Request, Response } from 'express';
import { acceptsJsonMiddleware } from '../src/index.mjs';

interface IStatus {
    status: number;
}

function buildServer(): Application {
    const app = express();
    return app.use(
        acceptsJsonMiddleware,
        (_req: Request, res: Response): unknown => res.json({ status: 200 }),
        (err: unknown, _req: Request, res: Response, _next: NextFunction): unknown =>
            res.status((err as IStatus).status).json(err),
    );
}

const server = buildServer();

describe('acceptsJsonMiddleware', function (): void {
    // eslint-disable-next-line mocha/no-setup-in-describe
    (
        [
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
        ] as const
    ).forEach(([accepts, ok]) =>
        it(`should handle case ${accepts} correctly`, function () {
            let req = request(server).get('/');
            if (accepts !== null) {
                req = req.set('Accept', accepts);
            }

            return req.expect(ok ? 200 : 406);
        }),
    );
});
