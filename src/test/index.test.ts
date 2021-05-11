import request from 'supertest';
import express, { NextFunction, Request, Response } from 'express';
import middleware from '..';

interface IStatus {
    status: number;
}

function buildServer(): express.Application {
    const app = express();
    app.disable('x-powered-by');
    app.use(middleware());
    app.use((req: Request, res: Response): unknown => res.json({ status: 200 }));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    app.use((err: any, req: Request, res: Response, next: NextFunction): unknown =>
        res.status((err as IStatus).status).json(err),
    );
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
    ])('should handle case %s correctly', (accepts: string | null, ok: boolean): Promise<unknown> => {
        let req = request(server).get('/');
        if (accepts !== null) {
            req = req.set('Accept', accepts);
        }

        return req.expect(ok ? 200 : 406);
    });
});
