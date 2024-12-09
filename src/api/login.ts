import { mobileSDKRedirect } from '../lib/helper';
import { store } from '../store';
import { _request } from './requests';

export type DecryptRequestBody = {
  ecRequest: string;
  fiuId: string;
  reqDate: string;
};

export type CustomDecryptRequestBody = {
  data: any;
};

export type EncryptRequestBody = {
  fiuid: string;
  AAId: string;
  ecRequest: string;
  reqDate: number;
};

export type EcRequestType = Pick<
  DecryptResponse,
  'txnid' | 'sessionid' | 'srcref' | 'userid' | 'fipid' | 'addfip' | 'redirect'
> & {
  [key: string]: string | number;
  errorCode: number;
  status: string;
};

export type RegisterLoginRequestBody = {
  I_MOBILENUMBER: string;
  I_CLIENTIP: string;
  I_BROWSER: string;
  I_MPIN?: string;
};

export type ValidateOTPRequestBody = {
  I_MOBILENUMBER: string;
  I_MOBOTP: string;
  I_BROWSER: string;
  I_CLIENTIP: string;
  I_Flag: string;
};

export type ColorSchemeStringType = `${string},${string}`;

export type ColorSchemeType = {
  primaryColor: string | null;
  secondaryColor: string | null;
};

export type DecryptResponse = {
  errorcode: string;
  fiuid: string;
  mobile: string;
  redirect: string;
  sessionid: string;
  srcref: string;
  status: string;
  statuscode: string;
  txnid: string;
  userid: string;
  uuid: string;
  addfip: string;
  fipid: string;
  fiuColourScheme: ColorSchemeStringType;
};

export type LoginResponse = {
  errorcode: string;
  fiuid: string;
  mobile: string;
  redirect: string;
  sessionid: string;
  srcref: string;
  status: string;
  statuscode: string;
  txnid: string;
  userid: string;
  uuid: string;
};

export type RegisterLoginResponse = {
  ExistUser: boolean;
  ConsentCount: string | number | null;
  ConsentId: string | null;
  PHOTO: string | null;
  USER_ID: string | null;
  RESULT_CODE: string;
  MESSAGE: string;
  SMSRESULT_CODE: string | null;
  SMSMESSAGE: string | null;
  SESSION_ID: string | null;
  USERNAME: string | null;
  MOBILE: string;
  EMAIL: string | null;
  LASTACCTIME: string | null;
};

export type EncryptResponseBody = {
  ecreq: string;
  fiuid: string;
};

export type RegisterOTPResponse = {
  ExistUser: boolean;
  ConsentCount: string;
  ConsentId: string | null;
  PHOTO: string | null;
  USER_ID: string | null;
  RESULT_CODE: string;
  MESSAGE: string;
  SMSRESULT_CODE: string | null;
  SMSMESSAGE: string | null;
  SESSION_ID: string | null;
  UUID: string | null;
  USERNAME: string | null;
  MOBILE: string;
  EMAIL: string | null;
  LASTACCTIME: string | null;
};

export async function decryptParameters(body: DecryptRequestBody) {
  const responseBody = _request<DecryptResponse>({
    relativeUrl: `/AES256_XOR_Decrypt`,
    method: 'POST',
    body: { ...body, flag: 'user_validation' },
    sendSessionID_login: false,
    sendUserId: false,
    sendConsentHandle: false,
  });
  return responseBody;
}

export async function encryptParameters(body: EncryptRequestBody) {
  const responseBody = _request<EncryptResponseBody>({
    relativeUrl: `/AES256_XOR_Encrypt`,
    method: 'POST',
    body: { ...body },
    sendSessionID_login: false,
    sendUserId: false,
    sendConsentHandle: false,
  });
  return responseBody;
}

export async function registerLoginUser(body: RegisterLoginRequestBody) {
  const responseBody = _request<RegisterLoginResponse>({
    relativeUrl: `/TRIGGEROTP`,
    method: 'POST',
    body,
  });
  return responseBody;
}

export async function VerifyLoginOtp(body: ValidateOTPRequestBody) {
  const responseBody = _request<RegisterOTPResponse>({
    relativeUrl: `/VERIFYOTP_V1`,
    method: 'POST',
    body,
  });
  return responseBody;
}

let getIpAddressPromise: Promise<string>;

export const getIPAddress = async () => {
  const {
    auth: { sdkType },
  } = store.getState();

  if (!getIpAddressPromise) {
    getIpAddressPromise = fetch('https://geolocation-db.com/json/')
      .then((response) => response.json())
      .then((data) => {
        return data.IPv4;
      })
      .catch((error) => {
        return '';
      });
  }
  return getIpAddressPromise;
};
