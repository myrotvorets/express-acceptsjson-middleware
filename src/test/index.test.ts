import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express';
import middleware from '..';

function buildServer(): express.Application {
    const server = express();
    server.use(middleware());
    server.use((req: Request, res: Response): unknown => res.json({ status: 200 }));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    server.use((err: any, req: Request, res: Response, next: NextFunction): unknown =>
        res.status(err.status).json(err),
    );
    return server;
}

const server = buildServer();

describe('Middleware', (): void => {
    it.each([
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
    ])(
        'should handle case %s correctly',
        (accepts: string | null, ok: boolean): Promise<unknown> => {
            let req = request(server).get('/');
            if (accepts !== null) {
                req = req.set('Accept', accepts);
            }

            return req.expect(ok ? 200 : 406);
        },
    );
});
