import axios, { type Method } from 'axios';
import { Router, type Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import { env } from '../../config/env';
import { logger } from '../../config/logger';
import { sendError } from '../../lib/http';

const storeProxyRouter = Router();

function buildTargetUrl(req: Request): string {
  return `${env.STORE_SERVICE_BASE_URL}${req.originalUrl}`;
}

function getForwardHeaders(req: Request): Record<string, string> {
  const headers: Record<string, string> = {};
  const authorization = req.header('authorization');
  const contentType = req.header('content-type');
  const accept = req.header('accept');

  if (authorization) {
    headers.authorization = authorization;
  }

  if (contentType) {
    headers['content-type'] = contentType;
  }

  if (accept) {
    headers.accept = accept;
  }

  headers['x-request-id'] = req.requestId;

  return headers;
}

storeProxyRouter.all('*', async (req, res) => {
  const targetUrl = buildTargetUrl(req);
  const method = req.method.toUpperCase() as Method;
  const data = method === 'GET' || method === 'HEAD' ? undefined : req.body;

  try {
    const response = await axios.request({
      method,
      url: targetUrl,
      data,
      headers: getForwardHeaders(req),
      timeout: env.STORE_SERVICE_TIMEOUT_MS,
      validateStatus: () => true,
    });

    return res.status(response.status).send(response.data);
  } catch (error) {
    const err = error as { code?: string; message?: string };
    logger.error(
      {
        code: err.code,
        message: err.message,
        targetUrl,
      },
      'Store proxy request failed',
    );

    return sendError(res, StatusCodes.SERVICE_UNAVAILABLE, {
      code: 'STORE_SERVICE_UNAVAILABLE',
      message: 'Store service is unavailable',
    });
  }
});

export { storeProxyRouter };
