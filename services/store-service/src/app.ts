import path from 'node:path';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors, { type CorsOptions } from 'cors';
import express, { type NextFunction, type Request, type Response } from 'express';
import helmet from 'helmet';
import { env } from './config/env';
import { errorHandler } from './middleware/error-handler';
import { notFoundHandler } from './middleware/not-found';
import { globalRateLimiter } from './middleware/rate-limit';
import { requestIdMiddleware } from './middleware/request-id';
import { requestLogger } from './middleware/request-logger';
import { healthRouter } from './modules/health/health.routes';
import { productRouter } from './modules/product/product.routes';
import { internalStoreRouter } from './modules/store/internal-store.routes';
import { storeRouter } from './modules/store/store.routes';

const requestBodyLimit = '5mb';

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

function normalizeUploadFileRequestPath(req: Request, _res: Response, next: NextFunction): void {
  const [pathname, query = ''] = req.url.split('?');
  const normalizedPathname = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;

  if (normalizedPathname !== pathname && path.posix.extname(normalizedPathname)) {
    req.url = `${normalizedPathname}${query ? `?${query}` : ''}`;
  }

  next();
}

app.disable('x-powered-by');
app.use(requestIdMiddleware);
app.use(requestLogger);
app.use(helmet());
app.use(cors(corsOptions));
app.use(compression());
app.use(express.json({ limit: requestBodyLimit }));
app.use(express.urlencoded({ extended: true, limit: requestBodyLimit }));
app.use(cookieParser());
app.use(globalRateLimiter);
app.use(
  '/uploads',
  normalizeUploadFileRequestPath,
  express.static(path.resolve(__dirname, '../uploads')),
);

app.use(healthRouter);
app.use('/internal/stores', internalStoreRouter);
app.use('/v1/products', productRouter);
app.use('/v1/stores', storeRouter);

app.use(notFoundHandler);
app.use(errorHandler);
