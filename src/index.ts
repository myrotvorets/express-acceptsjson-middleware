import type { NextFunction, Request, RequestHandler, Response } from 'express';

const payload = {
    success: false,
    status: 406,
    code: 'SHOULD_ACCEPT_JSON',
    message: 'Not acceptable',
};

export default function (): RequestHandler {
    return function acceptsJsonMiddleware(req: Request, res: Response, next: NextFunction): void {
        const p = !req.headers.accept || req.accepts('json') ? null : payload;
        next(p);
    };
}
