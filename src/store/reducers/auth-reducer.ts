import { AnyAction } from 'redux';

import {
  AES256_XOR_DECRYPT_SUCCESS,
  AuthState,
  LOGOUT_SUCCESS,
  LoginData,
  UPDATE_LOGIN_SESSION_ID,
  UPDATE_SDK_TYPE,
  UPDATE_SESSION_ID,
  USER_HANDLE_SUCCESS,
  USER_REG_MOBILE,
  USER_REG_MOBILE_SUCCESS,
  UpdatedSatus,
} from '../types/login';

const initialState: Partial<AuthState> = {
  sessionId_decrypt: null,
  sessionId_login: null,
  sessionId_last_call: null,
  decrypt: null,
  loginResponse: null,
  addNumberFlow: false,
  sdkType: null,
  userData : "",
  CurrentStatus:""
};

function authReducer(state = initialState, action: AnyAction) {
  switch (action.type) {
    case AES256_XOR_DECRYPT_SUCCESS: {
      return {
        ...state,
        decrypt: { ...action.body, userid: action.body.userid.split('@')[0] },
        sessionId_decrypt: action.body.sessionid,
        addNumberFlow:
          action.body.addfip === ''
            ? true
            : action.body.addfip.toLowerCase() === 'false'
            ? false
            : true,
      };
    }
    case LoginData : {
      return {
        ...state,
        userData: action.body,
      };
    }

    case UpdatedSatus : {
      return { ...state, CurrentStatus: action.body };
    }
    case UPDATE_SDK_TYPE: {
      return {
        ...state,
        sdkType: action.body.sdkType || 'web',
      };
    }
    case UPDATE_SESSION_ID: {
      return {
        ...state,
        sessionId_last_call: action.sessionid,
      };
    }
    case UPDATE_LOGIN_SESSION_ID: {
      return {
        ...state,
        sessionId_login: action.sessionid,
      };
    }
    case USER_REG_MOBILE_SUCCESS:
    case USER_REG_MOBILE:
    case USER_HANDLE_SUCCESS:
      return {
        ...state,
        handle: action.body,
        sessionId: action.body.sessionid,
      };

    case LOGOUT_SUCCESS: {
      return {
        ...initialState,
      };
    }
    default:
      return state;
  }
}

export default authReducer;
