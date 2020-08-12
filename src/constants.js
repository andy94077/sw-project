export const SERVER_URL = "http://pinterest-server.test";
export const REDIS_URL = `${SERVER_URL}:6001`;
export function CONCAT_SERVER_URL(url) {
  return url.startsWith(SERVER_URL) ? url : `${SERVER_URL}${url}`;
}
