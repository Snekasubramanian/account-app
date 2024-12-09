import { v4 as uuidv4 } from 'uuid';

import { mobileSDKRedirect } from '../lib/helper';
import { store } from '../store';
import AES from './aes';
import AuthError from './auth-error';
import { API_BASE_URL } from './urls';

export const BASE_URL = API_BASE_URL + '/api/aa/WPortalapiV1';

function debugLog(...args: any[]) {
  if (import.meta.env.MODE !== 'prod') {
    console.log(...args);
  }
}

type GetProps = {
  method: 'GET' | 'POST';
  relativeUrl: string;
  additionalHeaders?: Record<string, string>;
  sendSessionID_last_call?: boolean;
  sendSessionID_login?: boolean;
  sendSessionID_decrypt?: boolean;
  sendUUID?: boolean;
  sendUserId?: boolean;
  useRelativeUrl?: boolean;
  fixtureEnabled?: boolean;
  useEncryption?: boolean;
  json?: string;
  sendConsentHandle?: boolean;
  body?: Record<string, any>;
};
type PostProps = GetProps & {
  body: Record<string, any>;
};

const DEFAULT_HEADERS = {
  'Content-Type': 'text/plain',
  Accept: 'application/json',
};

export async function _request<T>({
  method,
  relativeUrl,
  additionalHeaders = {},
  body,
  useRelativeUrl = true,
  sendSessionID_last_call = false,
  sendSessionID_login = true,
  sendSessionID_decrypt = false,
  sendUserId = true,
  sendUUID = true,
  fixtureEnabled = false,
  json = '',
  useEncryption = true,
  sendConsentHandle = true,
}: GetProps | PostProps): Promise<T> {
  let reqBody = { ...body };
  if (sendSessionID_login) {
    debugLog(store.getState().auth.sessionId_login);
    store.getState().auth.sessionId_login &&
      (reqBody.I_SESSION = store.getState().auth.sessionId_login);
  }
  if (sendSessionID_decrypt) {
    store.getState().auth.sessionId_decrypt &&
      (reqBody.I_SESSION = store.getState().auth.sessionId_decrypt);
  }
  if (sendSessionID_last_call) {
    store.getState().auth.sessionId_last_call &&
      (reqBody.I_SESSION = store.getState().auth.sessionId_last_call);
  }

  if (sendUserId) {
    store.getState().auth.decrypt.userid &&
      (reqBody.I_USERID = store.getState().auth.decrypt?.userid ?? '');
  }
  if (sendUUID) {
    reqBody.UUID = uuidv4();
  }
  if (sendConsentHandle) {
    store.getState().auth.decrypt.userid &&
      (reqBody.I_ConsentHandle = store.getState()?.auth?.decrypt?.srcref ?? '');
  }
  const headers = { ...DEFAULT_HEADERS, ...additionalHeaders };

  if (fixtureEnabled && json) {
    const url = `/fixtures/${json}`;
    const responseBody = await fetch(url);
    return responseBody.json();
  }

  debugLog(`Request body for ${relativeUrl}`, reqBody);

  const payload = useEncryption
    ? new AES().encrypt(JSON.stringify(reqBody || {}))
    : JSON.stringify(reqBody || {});
  const controller = new AbortController();
  setTimeout(() => controller.abort(), 25000);
  const response = await fetch(
    useRelativeUrl ? `${BASE_URL}${relativeUrl}` : relativeUrl,
    {
      method,
      headers,
      signal: controller.signal,
      ...(method === 'GET' ? {} : { body: payload }),
    },
  );
  const responseBody =
    response.headers.get('content-type') === 'application/json; charset=utf-8' ||
    response.headers.get('content-type') === 'application/json'
      ? await response.json()
      : await response.text();

  const {
    auth: { sdkType },
  } = store.getState();

  if (response.status === 401) {
    store.dispatch({ type: 'LOGOUT_SUCCESS' });
    throw new AuthError(responseBody.message);
  }
  // if (response.status >= 500) {
  //   mobileSDKRedirect(sdkType, {
  //     errorcode: response.status,
  //     errormessage: responseBody.message,
  //   });
  //   throw new Error(responseBody.message);
  // }
  // if (response.status >= 400) {
  //   mobileSDKRedirect(sdkType, {
  //     errorcode: response.status,
  //     errormessage: responseBody.message,
  //   });
  //   throw new Error(responseBody.message);
  // }
  // const isUrlEncrypt = relativeUrl.search('Encrypt') !== -1;
  if (useEncryption) {
    const decryptedBody = new AES().decrypt(responseBody);
    const parsedBody = JSON.parse(decryptedBody as string);
    debugLog(`Parsed response from ${relativeUrl}`, parsedBody);
    debugLog(`***********************************************`);
    return parsedBody;
  }
  return responseBody;
}
