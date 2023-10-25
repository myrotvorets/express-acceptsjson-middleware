# express-acceptsjson-middleware

Express.js middleware to check whether the client is willing to accept JSON response.

## Usage

```typescript
import { type Request, type Response, Router } from 'express';
import { acceptsJsonMiddleware } from '@myrotvorets/express-acceptsjson-middleware';

const router = Router();
router.get('/some-path', acceptsJsonMiddleware, otherHandler);
```

## What it Does

The middleware checks the presence of `Accept` HTTP header, and if it is there, it checks whther the client is willing to accept JSON. If not, it returns 406 Not Acceptable error (with JSON payload :-) ).

It is considered that the client is willing to accept JSON if at least one of the following conditions is true:
  * there is no `Accept` header;
  * `Accept` header contains `*/*` or `*/json`;
  * `Accept` header contains `application/*` or `application/json`.

The actual check is performed by [Request.accepts()](https://expressjs.com/en/4x/api.html#req.accepts).
