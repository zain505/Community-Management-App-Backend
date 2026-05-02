import http, {
  type IncomingHttpHeaders,
  type IncomingMessage,
  type OutgoingHttpHeaders,
  type Server as HttpServer,
  type ServerResponse,
} from 'node:http';
import https from 'node:https';
import net from 'node:net';
import tls from 'node:tls';
import { pipeline } from 'node:stream/promises';
import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { env } from '../../config/env';
import { logger } from '../../config/logger';
import { sendError } from '../../lib/http';

const SOCKET_IO_PATH_PREFIX = '/socket.io';

const socketIoTarget = new URL(env.APP_SERVICE_URL);

function getTargetPort(): number {
  if (socketIoTarget.port) {
    return Number(socketIoTarget.port);
  }

  return socketIoTarget.protocol === 'https:' ? 443 : 80;
}

function getTargetHostHeader(): string {
  const targetPort = getTargetPort();
  const isDefaultPort =
    (socketIoTarget.protocol === 'http:' && targetPort === 80) ||
    (socketIoTarget.protocol === 'https:' && targetPort === 443);

  return isDefaultPort ? socketIoTarget.hostname : `${socketIoTarget.hostname}:${targetPort}`;
}

function joinTargetPath(pathname: string): string {
  const normalizedBasePath =
    socketIoTarget.pathname === '/' ? '' : socketIoTarget.pathname.replace(/\/$/, '');
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;

  return `${normalizedBasePath}${normalizedPath}`;
}

function resolveTargetRequestPath(requestUrl: string): string {
  const parsedUrl = new URL(requestUrl, 'http://socket-io-proxy.local');
  return `${joinTargetPath(parsedUrl.pathname)}${parsedUrl.search}`;
}

function getForwardHeaders(req: Request): OutgoingHttpHeaders {
  return {
    ...req.headers,
    host: getTargetHostHeader(),
    'x-forwarded-host': req.headers.host,
    'x-forwarded-proto': req.protocol,
    'x-request-id': req.requestId,
  };
}

function copyResponseHeaders(res: ServerResponse, headers: IncomingHttpHeaders): void {
  for (const [headerName, headerValue] of Object.entries(headers)) {
    if (
      headerValue === undefined ||
      ['connection', 'content-length', 'keep-alive', 'transfer-encoding'].includes(
        headerName.toLowerCase(),
      )
    ) {
      continue;
    }

    res.setHeader(headerName, headerValue);
  }
}

function createHttpProxyRequest(
  req: Request,
  onResponse: (upstreamResponse: IncomingMessage) => void,
) {
  const requestOptions = {
    protocol: socketIoTarget.protocol,
    hostname: socketIoTarget.hostname,
    port: getTargetPort(),
    method: req.method,
    path: resolveTargetRequestPath(req.originalUrl),
    headers: getForwardHeaders(req),
  };

  return socketIoTarget.protocol === 'https:'
    ? https.request(requestOptions, onResponse)
    : http.request(requestOptions, onResponse);
}

export function isSocketIoRequestPath(requestUrl?: string): boolean {
  if (!requestUrl) {
    return false;
  }

  const { pathname } = new URL(requestUrl, 'http://socket-io-proxy.local');
  return pathname === SOCKET_IO_PATH_PREFIX || pathname.startsWith(`${SOCKET_IO_PATH_PREFIX}/`);
}

export async function proxySocketIoHttpRequest(req: Request, res: Response): Promise<void> {
  const targetPath = resolveTargetRequestPath(req.originalUrl);

  await new Promise<void>((resolve) => {
    const proxyRequest = createHttpProxyRequest(req, (upstreamResponse) => {
      copyResponseHeaders(res, upstreamResponse.headers);
      res.status(upstreamResponse.statusCode ?? StatusCodes.BAD_GATEWAY);

      void pipeline(upstreamResponse, res)
        .catch((error) => {
          if (res.headersSent) {
            logger.warn(
              {
                code: (error as NodeJS.ErrnoException).code,
                message: (error as Error).message,
                targetPath,
              },
              'Socket.IO proxy response stream closed before completion',
            );
            return;
          }

          logger.error(
            {
              code: (error as NodeJS.ErrnoException).code,
              message: (error as Error).message,
              targetPath,
            },
            'Socket.IO proxy response stream failed',
          );

          sendError(res, StatusCodes.SERVICE_UNAVAILABLE, {
            code: 'APP_SERVICE_UNAVAILABLE',
            message: 'App service is unavailable',
          });
        })
        .finally(resolve);
    });

    proxyRequest.on('error', (error) => {
      const proxyError = error as NodeJS.ErrnoException;

      logger.error(
        {
          code: proxyError.code,
          message: proxyError.message,
          targetPath,
        },
        'Socket.IO proxy request failed',
      );

      if (!res.headersSent) {
        sendError(res, StatusCodes.SERVICE_UNAVAILABLE, {
          code: 'APP_SERVICE_UNAVAILABLE',
          message: 'App service is unavailable',
        });
      }

      resolve();
    });

    void pipeline(req, proxyRequest).catch((error) => {
      logger.warn(
        {
          code: (error as NodeJS.ErrnoException).code,
          message: (error as Error).message,
          targetPath,
        },
        'Socket.IO proxy request stream closed before completion',
      );

      if (!proxyRequest.destroyed) {
        proxyRequest.destroy(error as Error);
      }

      resolve();
    });
  });
}

function buildUpgradeRequestHeaders(req: IncomingMessage): string {
  const headerLines: string[] = [];
  let hasHostHeader = false;
  let hasConnectionHeader = false;
  let hasUpgradeHeader = false;

  for (let index = 0; index < req.rawHeaders.length; index += 2) {
    const headerName = req.rawHeaders[index];
    const headerValue = req.rawHeaders[index + 1] ?? '';
    const normalizedHeaderName = headerName.toLowerCase();

    if (normalizedHeaderName === 'host') {
      headerLines.push(`Host: ${getTargetHostHeader()}`);
      hasHostHeader = true;
      continue;
    }

    if (normalizedHeaderName === 'connection') {
      headerLines.push('Connection: Upgrade');
      hasConnectionHeader = true;
      continue;
    }

    if (normalizedHeaderName === 'upgrade') {
      headerLines.push(`Upgrade: ${headerValue}`);
      hasUpgradeHeader = true;
      continue;
    }

    headerLines.push(`${headerName}: ${headerValue}`);
  }

  if (!hasHostHeader) {
    headerLines.push(`Host: ${getTargetHostHeader()}`);
  }

  if (!hasConnectionHeader) {
    headerLines.push('Connection: Upgrade');
  }

  if (!hasUpgradeHeader) {
    headerLines.push('Upgrade: websocket');
  }

  return headerLines.join('\r\n');
}

function createUpstreamSocket() {
  const targetPort = getTargetPort();

  return socketIoTarget.protocol === 'https:'
    ? tls.connect({
        host: socketIoTarget.hostname,
        port: targetPort,
        servername: socketIoTarget.hostname,
      })
    : net.connect({
        host: socketIoTarget.hostname,
        port: targetPort,
      });
}

export function attachSocketIoUpgradeProxy(server: HttpServer): void {
  server.on('upgrade', (req, socket, head) => {
    if (!isSocketIoRequestPath(req.url)) {
      socket.destroy();
      return;
    }

    const targetPath = resolveTargetRequestPath(req.url ?? SOCKET_IO_PATH_PREFIX);
    const upstreamSocket = createUpstreamSocket();

    const closeSockets = () => {
      if (!socket.destroyed) {
        socket.destroy();
      }

      if (!upstreamSocket.destroyed) {
        upstreamSocket.destroy();
      }
    };

    upstreamSocket.once('error', (error) => {
      logger.error(
        {
          code: (error as NodeJS.ErrnoException).code,
          message: error.message,
          targetPath,
        },
        'Socket.IO websocket proxy failed',
      );

      if (socket.writable && !socket.destroyed) {
        socket.end('HTTP/1.1 502 Bad Gateway\r\nConnection: close\r\n\r\n');
      }

      closeSockets();
    });

    socket.once('error', () => {
      closeSockets();
    });

    socket.once('close', () => {
      closeSockets();
    });

    upstreamSocket.once('close', () => {
      closeSockets();
    });

    upstreamSocket.once('connect', () => {
      const upgradeRequest = [
        `${req.method ?? 'GET'} ${targetPath} HTTP/${req.httpVersion}`,
        buildUpgradeRequestHeaders(req),
        '',
        '',
      ].join('\r\n');

      upstreamSocket.write(upgradeRequest);

      if (head.length > 0) {
        upstreamSocket.write(head);
      }

      socket.pipe(upstreamSocket);
      upstreamSocket.pipe(socket);
    });
  });
}
