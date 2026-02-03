import cors from '@koa/cors';
import Koa from 'koa';
import { CORS_ORIGIN, PORT } from '#app/config.ts';
import { koaBody } from 'koa-body';
import { authRouter, usersRouter } from '#app/routes/index.ts';
import { errorHandler } from '#app/middleware/error-handler.ts';

const app = new Koa();

// Centralized error handling (keeps controllers lean and consistent)
app.use(errorHandler);

app.use(
  cors({
    allowMethods: ['GET', 'PUT', 'DELETE', 'POST', 'OPTIONS'],
    origin: CORS_ORIGIN,
  })
);

app.use(koaBody());

// Setup api routes
app.use(authRouter.routes());
app.use(usersRouter.routes());

app.listen(PORT, () => console.log(`🚀 Server ready at: http://localhost:${PORT}`));
