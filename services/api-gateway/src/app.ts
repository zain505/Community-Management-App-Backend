import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors, { type CorsOptions } from 'cors';
import express from 'express';
import helmet from 'helmet';
import { env, isAllowedCorsOrigin } from './config/env';
import { errorHandler } from './middleware/error-handler';
import { notFoundHandler } from './middleware/not-found';
import { globalRateLimiter } from './middleware/rate-limit';
import { requestIdMiddleware } from './middleware/request-id';
import { requestLogger } from './middleware/request-logger';
import { healthRouter } from './modules/health/health.routes';
import { isSocketIoRequestPath, proxySocketIoHttpRequest } from './modules/proxy/socket-io-proxy';
import { proxyRouter } from './modules/proxy/proxy.routes';

const requestBodyLimit = '8mb';

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (isAllowedCorsOrigin(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error('Origin is not allowed by CORS'));
  },
  credentials: true,
};

export const app = express();

app.disable('x-powered-by');
app.set('trust proxy', env.TRUST_PROXY);
app.use(requestIdMiddleware);
app.use(requestLogger);
app.use(helmet());
app.use(cors(corsOptions));
app.use(compression());
app.use(express.json({ limit: requestBodyLimit }));
app.use(express.urlencoded({ extended: true, limit: requestBodyLimit }));
app.use(cookieParser());
app.use(globalRateLimiter);

app.use((req, res, next) => {
  if (!isSocketIoRequestPath(req.originalUrl)) {
    next();
    return;
  }

  void proxySocketIoHttpRequest(req, res);
});

app.use(healthRouter);
app.use(proxyRouter);

app.use(notFoundHandler);
app.use(errorHandler);
