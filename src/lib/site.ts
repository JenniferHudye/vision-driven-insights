import siteConfig from "../../config/site.json";

export const site = siteConfig;
export const SITE_URL = siteConfig.url;
export const SITE_NAME = siteConfig.siteName;
export const CONVERSION_URL = siteConfig.conversionUrl;
export const CONVERSION_LABEL = siteConfig.conversionLabel;

export function absUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
