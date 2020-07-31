import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express';
import middleware from '..';

function buildServer(): express.Application {
    const app = express();
    app.use(middleware());
    app.use((req: Request, res: Response): unknown => res.json({ status: 200 }));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    app.use((err: any, req: Request, res: Response, next: NextFunction): unknown => res.status(err.status).json(err));
    return app;
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
        ['application/vnd.acme.account+json', false],
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
