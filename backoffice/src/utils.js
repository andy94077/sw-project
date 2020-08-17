import { SERVER_URL, BACKOFFICE_URL } from "./constants";

export function CONCAT_SERVER_URL(url) {
  return url.startsWith(SERVER_URL) ? url : `${SERVER_URL}${url}`;
}

export function CONCAT_BACKOFFICE_URL(url) {
  return url.startsWith(BACKOFFICE_URL) ? url : `${BACKOFFICE_URL}${url}`;
}
