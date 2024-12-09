import { DecryptResponse, LoginResponse } from '../../api/login';

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';

export const AES256_XOR_DECRYPT = 'AES256_XOR_DECRYPT';
export const AES256_XOR_DECRYPT_SUCCESS = 'AES256_XOR_DECRYPT_SUCCESS';

export const UPDATE_LOGIN_SESSION_ID = 'UPDATE_LOGIN_SESSION_ID';
export const UPDATE_SESSION_ID = 'UPDATE_SESSION_ID';

export const USER_REG_MOBILE = 'USER_REG_MOBILE';
export const USER_REG_MOBILE_SUCCESS = 'USER_REG_MOBILE_SUCCESS';

export const USER_REG_MOBILE_VAL = 'USER_REG_MOBILE_VAL';
export const USER_REG_MOBILE_VAL_SUCCESS = 'USER_REG_MOBILE_VAL_SUCCESS';

export const USER_HANDLE = 'USER_HANDLE';
export const USER_HANDLE_SUCCESS = 'USER_HANDLE_SUCCESS';
export const MOBILE_SESSION_OUT = 'MOBILE_SESSION_OUT';

export const UPDATE_SDK_TYPE = 'UPDATE_SDK_TYPE';

export const LoginData = 'LoginData';

export const UpdatedSatus = 'UpdatedSatus';

export type AuthState = {
  sessionId_decrypt: string | any;
  sessionId_login: string | any;
  sessionId_last_call: string | any;
  decrypt: DecryptResponse | any;
  loginResponse: LoginResponse | any;
  addNumberFlow: boolean;
  sdkType: 'web' | 'ios' | 'android' | null;
  userData: string | any;
  CurrentStatus : string | any;
};
