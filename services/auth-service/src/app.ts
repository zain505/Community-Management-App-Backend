import path from 'node:path';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors, { type CorsOptions } from 'cors';
import express from 'express';
import helmet from 'helmet';
import { env } from './config/env';
import { errorHandler } from './middleware/error-handler';
import { notFoundHandler } from './middleware/not-found';
import { globalRateLimiter } from './middleware/rate-limit';
import { requestIdMiddleware } from './middleware/request-id';
import { requestLogger } from './middleware/request-logger';
import { authRouter, internalAuthRouter } from './modules/auth/auth.routes';
import { healthRouter } from './modules/health/health.routes';

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (!origin || env.CORS_ORIGINS.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error('Origin is not allowed by CORS'));
  },
  credentials: true,
};

export const app = express();

app.disable('x-powered-by');
app.use(requestIdMiddleware);
app.use(requestLogger);
app.use(helmet());
app.use(cors(corsOptions));
app.use(compression());
app.use(express.json({ limit: '8mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(globalRateLimiter);
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

app.use(healthRouter);
app.use('/v1/auth', authRouter);
app.use('/internal/auth', internalAuthRouter);

app.use(notFoundHandler);
app.use(errorHandler);
