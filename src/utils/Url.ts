export function formatUrl(url: string): { hostname: string; path: string } {

  let parsedUrl: URL | undefined;

  try {
    parsedUrl = new URL(url);
  } catch (error) {
    console.warn(`"${url}" is not an URL.\n`, error);    
    return { hostname: '', path: '' };
  }

  const hostname = parsedUrl.hostname.replace(/^www\./, "");
  const pathSegments = parsedUrl.pathname
    .split("/")
    .filter((segment) => segment);

  let path = pathSegments.join(" > ");
  if (pathSegments.length > 0) {
    path = "> " + path;
  }

  return { hostname, path };
}