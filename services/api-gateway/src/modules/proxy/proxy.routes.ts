import axios, { type Method } from 'axios';
import { Router, type Request, type Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { env } from '../../config/env';
import { logger } from '../../config/logger';
import { sendError } from '../../lib/http';

interface ProxyRouteConfig {
  prefix: string;
  targetBaseUrl: string;
  unavailableCode: string;
  unavailableMessage: string;
  rewritePrefix?: string;
}

const proxyRoutes: ProxyRouteConfig[] = [
  {
    prefix: '/v1/stores/newsfeed',
    targetBaseUrl: env.NEWSFEED_SERVICE_BASE_URL,
    unavailableCode: 'NEWSFEED_SERVICE_UNAVAILABLE',
    unavailableMessage: 'Newsfeed service is unavailable',
    rewritePrefix: '/v1/newsfeed',
  },
  {
    prefix: '/v1/newsfeed',
    targetBaseUrl: env.NEWSFEED_SERVICE_BASE_URL,
    unavailableCode: 'NEWSFEED_SERVICE_UNAVAILABLE',
    unavailableMessage: 'Newsfeed service is unavailable',
  },
  {
    prefix: '/v1/stores',
    targetBaseUrl: env.STORE_SERVICE_BASE_URL,
    unavailableCode: 'STORE_SERVICE_UNAVAILABLE',
    unavailableMessage: 'Store service is unavailable',
  },
  {
    prefix: '/v1/products',
    targetBaseUrl: env.STORE_SERVICE_BASE_URL,
    unavailableCode: 'STORE_SERVICE_UNAVAILABLE',
    unavailableMessage: 'Store service is unavailable',
  },
  {
    prefix: '/v1/announcements',
    targetBaseUrl: env.APP_SERVICE_BASE_URL,
    unavailableCode: 'APP_SERVICE_UNAVAILABLE',
    unavailableMessage: 'App service is unavailable',
  },
  {
    prefix: '/v1/auth',
    targetBaseUrl: env.AUTH_SERVICE_BASE_URL,
    unavailableCode: 'AUTH_SERVICE_UNAVAILABLE',
    unavailableMessage: 'Auth service is unavailable',
  },
];

function buildTargetUrl(req: Request, route: ProxyRouteConfig): string {
  const [pathname, query = ''] = req.originalUrl.split('?');
  const rewrittenPathname = route.rewritePrefix
    ? pathname.replace(route.prefix, route.rewritePrefix)
    : pathname;

  return `${route.targetBaseUrl}${rewrittenPathname}${query ? `?${query}` : ''}`;
}

function getForwardHeaders(req: Request): Record<string, string> {
  const headers: Record<string, string> = {
    'x-request-id': req.requestId,
  };

  const authorization = req.header('authorization');
  const contentType = req.header('content-type');
  const accept = req.header('accept');
  const cookie = req.header('cookie');

  if (authorization) {
    headers.authorization = authorization;
  }

  if (contentType) {
    headers['content-type'] = contentType;
  }

  if (accept) {
    headers.accept = accept;
  }

  if (cookie) {
    headers.cookie = cookie;
  }

  return headers;
}

function copyResponseHeaders(res: Response, headers: Record<string, unknown>): void {
  for (const [headerName, headerValue] of Object.entries(headers)) {
    if (
      headerValue === undefined ||
      ['content-length', 'transfer-encoding', 'connection'].includes(headerName.toLowerCase())
    ) {
      continue;
    }

    res.setHeader(headerName, headerValue as string | string[]);
  }
}

async function proxyRequest(route: ProxyRouteConfig, req: Request, res: Response): Promise<Response | void> {
  const method = req.method.toUpperCase() as Method;
  const targetUrl = buildTargetUrl(req, route);
  const data = method === 'GET' || method === 'HEAD' ? undefined : req.body;

  try {
    const response = await axios.request({
      method,
      url: targetUrl,
      data,
      headers: getForwardHeaders(req),
      timeout: env.PROXY_TIMEOUT_MS,
      validateStatus: () => true,
    });

    copyResponseHeaders(res, response.headers as Record<string, unknown>);
    return res.status(response.status).send(response.data);
  } catch (error) {
    const err = error as { code?: string; message?: string };
    logger.error(
      {
        code: err.code,
        message: err.message,
        targetUrl,
      },
      'Gateway proxy request failed',
    );

    return sendError(res, StatusCodes.SERVICE_UNAVAILABLE, {
      code: route.unavailableCode,
      message: route.unavailableMessage,
    });
  }
}

const proxyRouter = Router();

for (const route of proxyRoutes) {
  proxyRouter.use(route.prefix, (req, res) => {
    void proxyRequest(route, req, res);
  });
}

export { proxyRouter };
