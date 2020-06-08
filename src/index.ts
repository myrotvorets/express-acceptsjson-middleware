import type { NextFunction, Request, RequestHandler, Response } from 'express';

const payload = {
    status: 406,
    message: 'Not acceptable',
};

export default function (): RequestHandler {
    return function (req: Request, res: Response, next: NextFunction): void {
        const p = !req.headers.accept || req.accepts('json') ? null : payload;
        next(p);
    };
}
