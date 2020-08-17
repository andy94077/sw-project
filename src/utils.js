import { SERVER_URL } from "./constants";

// eslint-disable-next-line import/prefer-default-export
export function CONCAT_SERVER_URL(url) {
  return url.startsWith(SERVER_URL) ? url : `${SERVER_URL}${url}`;
}
