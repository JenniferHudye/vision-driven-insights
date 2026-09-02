import { useEffect } from "react";
import { SITE_NAME, SITE_URL } from "./site";

interface HeadOptions {
  title: string;
  description: string;
  path: string;
  image?: string;
}

function setMeta(selector: string, attr: "content", value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    const [, name] = selector.match(/\[(?:name|property)=["']([^"']+)["']\]/) ?? [];
    if (selector.includes("property=")) el.setAttribute("property", name ?? "");
    else el.setAttribute("name", name ?? "");
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/**
 * Client-side head management for the SPA experience only.
 * Crawler-facing head tags and JSON-LD are injected by the prerender scripts.
 */
export function useDocumentHead({ title, description, path, image }: HeadOptions) {
  useEffect(() => {
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
    const url = `${SITE_URL}${path}`;
    const img = image ?? `${SITE_URL}/og-default.png`;

    document.title = fullTitle;
    setMeta('meta[name="description"]', "content", description);
    setMeta('meta[property="og:title"]', "content", fullTitle);
    setMeta('meta[property="og:description"]', "content", description);
    setMeta('meta[property="og:url"]', "content", url);
    setMeta('meta[property="og:image"]', "content", img);
    setMeta('meta[name="twitter:title"]', "content", fullTitle);
    setMeta('meta[name="twitter:description"]', "content", description);
    setMeta('meta[name="twitter:image"]', "content", img);
    setCanonical(url);
  }, [title, description, path, image]);
}
