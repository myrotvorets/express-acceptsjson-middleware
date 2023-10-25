import type { NextFunction, Request, Response } from 'express';

const payload = {
    success: false,
    status: 406,
    code: 'SHOULD_ACCEPT_JSON',
    message: 'Not acceptable',
};

export function acceptsJsonMiddleware(req: Request, _res: Response, next: NextFunction): void {
    const p = !req.headers.accept || req.accepts('json') ? null : payload;
    next(p);
}
