import cryptoJs from 'crypto-js';
import Base64 from 'crypto-js/enc-base64';
import ReactGA from 'react-ga4';
import * as Tracker from '../../public/js/eventtracker';
import type { FIPDetailsList } from '../api/banks';
import {
  DecryptResponse,
  EcRequestType,
  encryptParameters,
  EncryptRequestBody,
  EncryptResponseBody,
} from '../api/login';
import { AA_ID } from '../api/urls';
import { store } from '../store';

const GA_ENABLED = import.meta.env.VITE_GA_ENABLED === 'true';

export const formatDate = (dt: string, monthInWords?: boolean) => {
  if (!dt) return '';
  const x = new Date(dt);
  if (isNaN(x.getTime())) return '';
  return x.toLocaleDateString('en-IN', {
    month: monthInWords ? 'short' : '2-digit',
    day: '2-digit',
    year: 'numeric',
  });
};

export const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLocaleLowerCase();
};

export const browserName = (function detectBrowser() {
  // const userAgent = navigator.userAgent;
  //  if (navigator.userAgent.match(/Android/i)){
  //   return 'Android'
  // }else if (userAgent.match(/chrome|chromium|crios/i)) {
  //   return 'chrome';
  // }else if (userAgent.match(/firefox|fxios/i)) {
  //   return 'firefox';
  // }else if (userAgent.match(/safari/i)) {
  //   return 'safari';
  // }else if (userAgent.match(/opr\//i)) {
  //   return 'opera';
  // }else if (userAgent.match(/edg/i)) {
  //   return 'edge';
  // }else if (navigator.userAgent.match(/iPhone/i)){
  //   return 'ios'
  // }
  return 'chrome';
})();

export function initializeGoogleAnalytics() {
  if (!GA_ENABLED) {
    return;
  }
  const TRACKING_ID = 'G-3TY409LFK4';
  const options = {
    trackingId: TRACKING_ID,
    debug: true,
    titleCase: false,
    gaOptions: {
      cookieDomain: 'none',
    },
  };
  ReactGA.initialize(TRACKING_ID, options);
}

export function setupGAPageView() {
  if (!GA_ENABLED) {
    return;
  }
  ReactGA.pageview(window.location.pathname + window.location.search);
}

export function setGAUserId(userId: string) {
  if (!GA_ENABLED) {
    return;
  }
  ReactGA.set({
    userId: userId,
  });
}

export function eventTracker(eventName:string,data:any){
  Tracker.eventTracker(eventName,data);
}

export function FetchOtp(){
  Tracker.getotp();
}

export function logEvent({
  category,
  action,
  label,
  value = 1,
}: {
  category: string;
  action: string;
  label: string;
  value: 0 | 1;
}): void {
  if (!GA_ENABLED) {
    return;
  }
  console.log(category, action, label, value);
  ReactGA.event({
    category,
    action,
    label,
    value,
  });
}

export function closeAndRedirect({
  url,
  parentStatusMessage,
  delay = true,
  decrypt,
  FIPDetailsList = null,
}: {
  url?: string;
  parentStatusMessage?: 'ACCEPTED' | 'REJECTED' | 'N';
  delay?: boolean;
  FIPDetailsList?: FIPDetailsList[] | null;
  decrypt?: DecryptResponse;
}) {
  // Send the status to parent window.
  const statusMessageMap = {
    ACCEPTED: 'S',
    REJECTED: 'F',
    N: 'N',
  };

  // const messageMap = {
  //   S: 'Consent is accepted',
  //   F: 'Consent is rejected',
  //   N: 'Window is closed by user',
  // };
  const statusCode: 'S' | 'F' | 'N' = (statusMessageMap[parentStatusMessage || 'N'] ||
    'N') as 'S' | 'F' | 'N';

  const {
    auth: { sdkType },
  } = store.getState();

  const postMessageParams = {
    status: statusCode,
    txnid: decrypt?.txnid,
    sessionid: decrypt?.sessionid,
  };

  const postMessageMobileParams = {
    status: statusCode,
    txnid: decrypt?.txnid,
    sessionid: decrypt?.sessionid,
    mobileNumber: decrypt?.mobile,
    ...(parentStatusMessage === 'ACCEPTED' && {
      fipDetailsList: JSON.stringify(FIPDetailsList),
    }),
  };

  mobileSDKRedirect(sdkType, postMessageMobileParams);
  if (window.opener) {
    window.opener.postMessage(postMessageParams, document.referrer);
    // window.opener.postMessage({ status: parentStatusMessage });
  }
  async function doClose() {
    if (url && decrypt) {
      // redirect
      const encryptedUrl = await generateEncryptedUrl(url, decrypt, statusCode);
      window.location.replace(encryptedUrl);
    } else {
      // try to close the window only if child.
      if (window.opener) {
        window.close();
      }
    }
  }
  if (delay) {
    setTimeout(doClose, 3000);
  } else {
    doClose();
  }
}

const checkIfURLHasQueryParams = (url: string): boolean => {
  const formattedURL = new URL(url);
  return Boolean(formattedURL.search);
};

export const mobileSDKRedirect = (sdkType: string, urlParams: any) => {
  let mobileURL = `https://newuat.camsfinserv.com/redirectSdk?`;
  // if (sdkType === 'ios' || sdkType === 'Android') {
    const urlParamKeys = Object.keys(urlParams);
    mobileURL += `${urlParamKeys[0]}=${urlParams[urlParamKeys[0]]}`;
    for (let i = 1; i < urlParamKeys.length; ++i) {
      mobileURL += `&${urlParamKeys[i]}=${urlParams[urlParamKeys[i]]}`;
    }
    window.location.replace(mobileURL);
    return;
  // }
};
async function generateEncryptedUrl(
  url: string,
  decrypt: DecryptResponse,
  statusCode: string,
): Promise<string> {
  const { encryptResponse, reqDate } = await getEncryptedEcRes(decrypt, statusCode);
  const constructedURL = `ecres=${
    encryptResponse?.ecreq
  }&resdate=${reqDate}&fi=${Base64.stringify(
    xorEncryptWordArray(String(AA_ID), String(reqDate)),
  )}`;
  if (checkIfURLHasQueryParams(url)) {
    return `${url}&${constructedURL}`;
  }
  return `${url}?${constructedURL}`;
}

async function getEncryptedEcRes(
  decrypt: DecryptResponse,
  statusString: string,
): Promise<{
  reqDate: number;
  encryptResponse: EncryptResponseBody;
}> {
  const ecRequest: EcRequestType = {
    addfip: decrypt.addfip,
    status: statusString,
    errorCode: statusString === 'S' ? 0 : 1,
    fipid: decrypt.fipid,
    redirect: decrypt.redirect,
    sessionid: decrypt.sessionid,
    srcref: decrypt.srcref,
    txnid: decrypt.txnid,
    userid: decrypt.mobile ? decrypt.mobile + '@CAMSAA' : decrypt.userid,
  };
  const ecRequestValue = Object.keys(ecRequest).reduce(
    (currentValue, ecRequestKey, index) => {
      if (index === 0) {
        currentValue += `${ecRequestKey}=${ecRequest[ecRequestKey]}`;
      } else {
        currentValue += `&${ecRequestKey}=${ecRequest[ecRequestKey]}`;
      }
      return currentValue;
    },
    '',
  );
  const reqDate = formatDateNew(new Date());
  const encryptReq: EncryptRequestBody = {
    fiuid: decrypt.fiuid,
    AAId: AA_ID,
    ecRequest: ecRequestValue,
    reqDate,
  };
  const encryptResponse = await encryptParameters(encryptReq);
  return { encryptResponse, reqDate };
}

function formatDateNew(date: Date): number {
  const padStartZero = (len: number, str: string) => {
    return str.padStart(len, '0');
  };
  const day = padStartZero(2, String(date.getDate()));
  const month = padStartZero(2, String(date.getMonth()));
  const year = padStartZero(2, String(date.getFullYear()));
  const hour = padStartZero(2, String(date.getHours()));
  const minutes = padStartZero(2, String(date.getMinutes()));
  const millis = padStartZero(3, String(date.getMilliseconds()));
  return Number(`${day}${month}${year}${hour}${minutes}${millis}`);
}

export function xorEncryptWordArray(data: string, key: string): cryptoJs.lib.WordArray {
  function keyCharAt(key: string, i: number) {
    return key.charCodeAt(Math.floor(i % key.length));
  }
  function byteArrayToWordArray(ba: any) {
    const wa: any[] = [];
    for (let i = 0; i < ba.length; i++) {
      wa[(i / 4) | 0] |= ba[i] << (24 - 8 * i);
    }
    return cryptoJs.lib.WordArray.create(wa, ba.length);
  }
  const res = data.split('').map(function (c, i) {
    return c.charCodeAt(0) ^ keyCharAt(key, i);
  });
  return byteArrayToWordArray(res);
}

export const differenceInMonths = (dt1: string, dt2: string) => {
  if (!dt1 || !dt2) return '';
  const x = new Date(dt1);
  const y = new Date(dt2);
  if (isNaN(x.getTime() || y.getTime())) return '';

  return y.getMonth() - x.getMonth() + 12 * (y.getFullYear() - x.getFullYear());
};
