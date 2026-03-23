import axios from 'axios';
import { env } from '../../config/env';

async function checkService(url: string): Promise<boolean> {
  try {
    const response = await axios.get(`${url}/ready`, {
      timeout: env.PROXY_TIMEOUT_MS,
      validateStatus: () => true,
    });

    return response.status >= 200 && response.status < 300;
  } catch {
    return false;
  }
}

export async function checkDownstreamReadiness(): Promise<{
  auth: boolean;
  store: boolean;
  newsfeed: boolean;
  app: boolean;
}> {
  const [auth, store, newsfeed, app] = await Promise.all([
    checkService(env.AUTH_SERVICE_BASE_URL),
    checkService(env.STORE_SERVICE_BASE_URL),
    checkService(env.NEWSFEED_SERVICE_BASE_URL),
    checkService(env.APP_SERVICE_BASE_URL),
  ]);

  return {
    auth,
    store,
    newsfeed,
    app,
  };
}
