import { env } from '../../config/env';

export interface AndroidVersionPolicy {
  latestBuild: number | null;
  minimumSupportedBuild: number | null;
  recommendedBuild: number | null;
  forceUpdate: boolean;
  storeUrl: string;
  title: string;
  message: string;
}

export interface MobileVersionPolicy {
  android: AndroidVersionPolicy;
}

export function getMobileVersionPolicy(): MobileVersionPolicy {
  return {
    android: {
      latestBuild: env.AWT_ANDROID_LATEST_BUILD,
      minimumSupportedBuild: env.AWT_ANDROID_MINIMUM_SUPPORTED_BUILD,
      recommendedBuild: env.AWT_ANDROID_RECOMMENDED_BUILD,
      forceUpdate: env.AWT_ANDROID_FORCE_UPDATE,
      storeUrl: env.AWT_ANDROID_STORE_URL,
      title: env.AWT_ANDROID_UPDATE_TITLE,
      message: env.AWT_ANDROID_UPDATE_MESSAGE,
    },
  };
}
