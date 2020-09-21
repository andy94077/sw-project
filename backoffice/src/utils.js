import { SERVER_URL, BACKOFFICE_URL, FRONTOFFICE_URL } from "./constants";

export function CONCAT_SERVER_URL(url) {
  return url.startsWith(SERVER_URL) ? url : `${SERVER_URL}${url}`;
}

export function CONCAT_BACKOFFICE_URL(url) {
  return url.startsWith(BACKOFFICE_URL) ? url : `${BACKOFFICE_URL}${url}`;
}

export function CONCAT_FRONTOFFICE_URL(url) {
  return url.startsWith(FRONTOFFICE_URL) ? url : `${FRONTOFFICE_URL}${url}`;
}
