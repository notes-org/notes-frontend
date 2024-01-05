export function formatUrl(url: string): { hostname: string; path: string } {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.replace(/^www\./, "");
    const pathSegments = parsedUrl.pathname
      .split("/")
      .filter((segment) => segment);

    let path = pathSegments.join(" > ");
    if (pathSegments.length > 0) {
      path = "> " + path;
    }

    return { hostname, path };
  } catch (error) {
    console.error("Invalid URL:", error);
    const hostname = "";
    const path = "";
    return { hostname, path };
  }
}
