import { _request } from './requests';

export type BankListRequestBody = {
  I_MOBILENUMBER: string;
  I_MPIN: string;
  I_BROWSER: string;
  I_asset_class_id: string;
  I_SEARCHKEY: string;
  I_SEARCHPAGENATION: string;
};

export type bankDetail = {
  discoveredbank: any;
  FIPID: string;
  FIPNAME: string;
  LOGO: string;
  POPULARBANK: string;
};

export type BankListResponseBody = {
  lst: bankDetail[];
  uuid: string;
  resulT_CODE: string;
  message: string;
  sessioN_ID: string;
};

export type discoverBanksRequestBody = {
  I_MOBILENUMBER: string;
  I_BROWSER: string;
  // For 0, 1, multiple fip ids
  // I_FIPID: string | string[];
  I_FIPID: string;
  I_FIPNAME: string;
  I_Identifier: [{ I_Flag: string; DATA: string; type: string }];
  I_FITYPE: string;
};

export type consentHandleDetailsRequestBody = {
  I_MOBILENUMBER: string;
  I_BROWSER: string;
  I_ConsentHandle: string;
};

export type ACCOUNTSTOLINK = {
  FIPACCNUM: string;
  FIPACCREFNUM: string;
  FIPACCTYPE: string;
  FIPTYPE: string;
  FIPID: string;
  Logo: string;
};

export type LinkRequestBody = {
  I_MOBILENUMBER: string;
  I_BROWSER: string;
  I_USERID: string;
  I_FIPID: string;
  ACCOUNTS_TO_LINK: ACCOUNTSTOLINK[];
};

export type Category = {
  type: string;
};

export type Purpose = {
  code: string;
  refUri: string;
  text: string;
  Category: Category;
};

export type Datafilter = {
  type: string;
  operator: string;
  value: string;
};

export type Lst = {
  FIUID: string;
  FIUNAME: string;
  LOGO: string;
  PURPOSECODE: string;
  REFURI: string;
  PURPOSEDESC: string;
  PURPOSE: Purpose;
  CUSTID: string;
  FIDATAFROMDATE: string;
  FIDATATODATE: string;
  CONSENTSTARTDATETIME: string;
  CONSENTEXPIRYDATETIME: string;
  CONSENTHANDLE: string;
  DATACONSUMERID: string;
  DATACONSUMERTYPE: string;
  CONSENTID: string;
  MFIDATAFROMDATE: string;
  MFIDATATODATE: string;
  MCONSENTSTARTDATETIME: string;
  MCONSENTEXPIRYDATETIME: string;
  DATAFILTER: Datafilter[];
  DATALIFEUNIT: string;
  DATALIFEVALUE: number;
  FREQUENCYUNIT: string;
  FREQUENCYVALUE: number;
  FETCHPERIOD: string;
  FITYPES: string;
  CONSENTMODE: string;
  CONSENTTYPES: string;
  FETCHTYPE: string;
  DATAPROVIDERID: string;
  DATAPROVIDERTYPE: string;
  PURPOSECODE1: string;
};

export type consentHandleDetailsResponse = {
  lst: Lst[];
  UUID: string;
  RESULT_CODE: string;
  MESSAGE?: any;
  SESSION_ID: string;
};

export type discoverBanksResponseBody = {
  fip_Namelist: string;
  linked_Mobile: string;
  sessioN_ID: string;
  AccountCount: string | number;
  i_Mobile: string;
  refNumber: string;
  i_Email: string;
  i_PAN: string;
  i_AADHAR: string;
  resulT_CODE: string;
  message: string;
  uuid: string;
  FIPName: string;
  identifiers: string;
  result: string;
  LOGO: string;
  fip_DiscoverLinkedlist: IndBank[];
  fip_NewDiscoverelist: IndBank[];
};

export type SelectedBankType = {
  [key: string]: IndBank[];
};

export type BankType = {
  FIPACCREFNUM: string;
  FIPACCTYPE: string;
  FIPACCNUM: string;
  FIPID: string;
  FITYPE: string;
  FIPNAME?: string;
  FIPACCLINKREF: string;
};

export type IndBank = BankType & {
  LINKEDDATE: string;
  CR_Status: string;
  Id: string;
  ACCDISCOVERYDATE: string;
  Logo: string;
  Linked: Boolean;
  FIPNAME: string;
  isChecked: boolean;
};

export type LinkAccountRequestBody = {
  I_MOBILENUMBER: string;
  I_BROWSER: string;
  I_FIPID: string;
  ACCOUNTS_TO_LINK: ACCOUNTSTOLINK[];
};

export type LinkAccountResponseBody = {
  fip_Namelist?: any;
  Linked_Mobile?: any;
  SESSION_ID?: any;
  AccountCount: number;
  I_Mobile?: any;
  RefNumber: string;
  I_Email?: any;
  I_PAN?: any;
  I_AADHAR?: any;
  RESULT_CODE: string;
  MESSAGE: string;
  UUID: string;
  FIPName?: any;
  Identifiers?: any;
  fip_NewDiscoverelist?: any;
  Result?: any;
};

export type AuthenticateTokenRequestBody = {
  I_MOBILENUMBER: string;
  I_BROWSER: string;
  I_FIPID: string;
  I_MOBOTP: string;
  I_FIPACCREFNUM: string;
};

export type FipNewDiscoverelist = {
  isChecked: boolean | Boolean;
  CR_Status?: any;
  Id?: any;
  FIPID: string;
  FITYPE?: any;
  ACCDISCOVERYDATE?: any;
  FIPACCTYPE: string;
  FIPACCREFNUM: string;
  FIPACCNUM: string;
  FIPACCLINKREF: string;
  LINKEDDATE?: any;
  Logo: string;
  FIPNAME: string;
  Linked: any;
};
export type FipDiscoverelist = {
  CR_Status?: any;
  Id?: any;
  FIPID: string;
  FITYPE?: any;
  ACCDISCOVERYDATE?: any;
  FIPACCTYPE: string;
  FIPACCREFNUM: string;
  FIPACCNUM: string;
  FIPACCLINKREF: string;
  LINKEDDATE?: any;
  Logo: string;
  FIPNAME: string;
  Linked: Boolean;
};

export type AuthenticateTokenResponseBody = {
  fip_Namelist?: any;
  Linked_Mobile?: any;
  SESSION_ID: string;
  AccountCount: number;
  I_Mobile?: any;
  RefNumber?: any;
  I_Email?: any;
  I_PAN?: any;
  I_AADHAR?: any;
  RESULT_CODE: string;
  MESSAGE: string;
  UUID: string;
  FIPName?: any;
  Identifiers?: any;
  fip_NewDiscoverelist: FipNewDiscoverelist[];
  Result?: any;
};

export type FIPDetailsList = AlreadyLinkedAccountsList & {
  isCardSelected: boolean;
};

export type ConsentArtefactRequestBody = {
  I_MOBILENUMBER: string;
  I_MPIN: string;
  I_BROWSER: string;
  FIPDetailsList: FIPDetailsList[];
  I_ConsentHandle: string;
};

export type GetMobilesRequestBody = {
  I_MOBILENUMBER: string;
  I_BROWSER: string;
};

export type GenerateOTPRequestBody = {
  I_BROWSER: string;
  I_MOBILENUMBER: string;
  I_SECONDARY_MOBILE_NUMBER: any;
};

export type AddNewNumberRequestBody = {
  I_MOBILENUMBER: string;
  I_SECONDARY_MOBILE_NUMBER: any;
  I_MOBOTP: string;
  I_BROWSER: string;
  I_Flag: string;
};

export type ConsentRejectRequestBody = {
  I_MOBILENUMBER: string;
  I_BROWSER: string;
  I_ConsentId: string;
  I_STATUS: string;
};

export type ConsentArtefactResponseBody = {
  ExistUser: boolean;
  ConsentCount?: any;
  ConsentId: string;
  PHOTO?: any;
  UUID: string;
  USER_ID?: any;
  RESULT_CODE: string;
  MESSAGE: string;
  SMSRESULT_CODE?: any;
  SMSMESSAGE?: any;
  USERNAME?: any;
  MOBILE?: any;
  EMAIL?: any;
  SESSION_ID?: any;
  LASTACCTIME?: any;
};

export type MobileList = {
  MobileNumber: string;
};

export type GetMobilesResponseBody = {
  lst: MobileList[];
  UUID: string;
  RESULT_CODE: string;
  MESSAGE: string;
  SESSION_ID: string;
};

export type GenerateOTPResponseBody = {
  ExistUser: boolean;
  ConsentCount?: any;
  ConsentId?: any;
  PHOTO?: any;
  UUID: string;
  USER_ID?: any;
  RESULT_CODE: string;
  MESSAGE: string;
  SMSRESULT_CODE?: any;
  SMSMESSAGE?: any;
  USERNAME?: any;
  MOBILE?: any;
  EMAIL?: any;
  SESSION_ID?: any;
  LASTACCTIME?: any;
};

export type AddNewNumberResponseBody = {
  ExistUser: boolean;
  ConsentCount?: any;
  ConsentId?: any;
  PHOTO?: any;
  UUID: string;
  USER_ID?: any;
  RESULT_CODE: string;
  MESSAGE: string;
  SMSRESULT_CODE?: any;
  SMSMESSAGE?: any;
  USERNAME?: any;
  MOBILE?: any;
  EMAIL?: any;
  SESSION_ID?: any;
  LASTACCTIME?: any;
};

export type ConsentRejectResponseBody = {
  lst?: any;
  UUID: string;
  RESULT_CODE: string;
  MESSAGE: string;
  SESSION_ID: string;
};

export type LinkDescRequestBody = {
  I_MOBILENUMBER: string;
  I_BROWSER: string;
};

export type selectedLinkedBank = {
  [key: string]: AlreadyLinkedAccountsList[];
};

export type AlreadyLinkedAccountsList = BankType & {
  LINKEDDATE: string;
  CUSTID: string;
  LINKINGREFNUM: string;
  CONSENTCOUNT: number;
  CONSENTDATE: Date;
  LOGO: string;
  FIPNAME: string;
};

export type LinkDescResponseBody = {
  lst?: AlreadyLinkedAccountsList[];
  UUID: string;
  RESULT_CODE: string;
  MESSAGE?: any;
  SESSION_ID: string;
};

export function discoverAlreadyLinkedAccount(body: LinkDescRequestBody) {
  const responseBody = _request<LinkDescResponseBody>({
    relativeUrl: `/LINKDESC`,
    method: 'POST',
    body,
    sendUserId: true,
    sendUUID: true,
  });
  return responseBody;
}

export async function BankList(body: BankListRequestBody) {
  const responseBody = _request<BankListResponseBody>({
    relativeUrl: `/SearchFIP`,
    method: 'POST',
    body,
    // useRelativeUrl: false,
    // sendSessionID: true,
    sendUserId: true,
    sendUUID: true,
    // fixtureEnabled: true,
    // json: 'banklist.json',
  });
  return responseBody;
}

// export async function discoverBanks(body: discoverBanksRequestBody) {
//   const { I_FIPID, I_FIPNAME, ...rest } = body;

//   // TODO : here fipid could be blank, one or multiple fipid's separated by commas in a stringify
//   // TODO : so discover banks for all the fipid's
//   const fipIds = I_FIPID.split(',');
//   const fipNames = I_FIPNAME.split(',');

//   let responseBody: Partial<discoverBanksResponseBody> & {
//     fip_NewDiscoverelist: Array<IndBank>;
//   } = {
//     fip_NewDiscoverelist: [],
//   };
//   for (let index = 0; index < fipIds.length; index++) {
//     const fipId = fipIds[index];
//     const responseBody_ = await _request<discoverBanksResponseBody>({
//       relativeUrl: `/DISCOVER`,
//       method: 'POST',
//       body: {
//         ...rest,
//         I_FIPID: fipId,
//         I_FIPNAME: fipNames[index],
//       },
//     });
//     responseBody = {
//       ...responseBody,
//       ...responseBody_,
//       fip_NewDiscoverelist: [
//         ...responseBody.fip_NewDiscoverelist,
//         ...(responseBody_.fip_NewDiscoverelist || []),
//       ],
//     };
//   }
//   return responseBody as discoverBanksResponseBody;
// }

export async function consentHandle(body: consentHandleDetailsRequestBody) {
  const responseBody = _request<consentHandleDetailsResponse>({
    relativeUrl: `/GETCONSENTHANDLEDETAILS`,
    method: 'POST',
    body,
  });
  return responseBody;
}

export async function LinkBankAccount(body: LinkAccountRequestBody) {
  const responseBody = _request<LinkAccountResponseBody>({
    relativeUrl: `/Link`,
    method: 'POST',
    body,
  });
  return responseBody;
}

export async function AuthenticateToken(body: AuthenticateTokenRequestBody) {
  const responseBody = _request<AuthenticateTokenResponseBody>({
    relativeUrl: `/AuthenticateToken`,
    method: 'POST',
    body,
  });
  return responseBody;
}

export async function ConsentArtefact(body: ConsentArtefactRequestBody) {
  const responseBody = _request<ConsentArtefactResponseBody>({
    relativeUrl: `/ConsentArtefact_V1`,
    method: 'POST',
    body,
  });
  return responseBody;
}

export async function getMobileNumbers(body: GetMobilesRequestBody) {
  const responseBody = _request<GetMobilesResponseBody>({
    relativeUrl: `/GETMOBILENUMBERS`,
    method: 'POST',
    body,
  });
  return responseBody;
}

export async function generateOTP(body: GenerateOTPRequestBody) {
  const responseBody = _request<GenerateOTPResponseBody>({
    relativeUrl: `/GENERATEOTP`,
    method: 'POST',
    body,
  });
  return responseBody;
}

export async function addNewMobile(body: AddNewNumberRequestBody) {
  const responseBody = _request<AddNewNumberResponseBody>({
    relativeUrl: `/ADDNEWMOBILE`,
    method: 'POST',
    body,
  });
  return responseBody;
}

export async function rejectConsent(body: ConsentRejectRequestBody) {
  const responseBody = _request<ConsentRejectResponseBody>({
    relativeUrl: `/ConsentStatusNotification`,
    method: 'POST',
    body,
  });
  return responseBody;
}

export async function discoverBanks(body: discoverBanksRequestBody) {
  const { I_FIPID, I_FIPNAME, ...rest } = body;

  // TODO : here fipid could be blank, one or multiple fipid's separated by commas in a stringify
  // TODO : so discover banks for all the fipid's
  const fipIds = I_FIPID.split(',');
  const fipNames = I_FIPNAME.split(',');

  let responseBody: Partial<discoverBanksResponseBody> & {
    fip_NewDiscoverelist: Array<IndBank>;
  } = {
    fip_NewDiscoverelist: [],
  };
  for (let index = 0; index < fipIds.length; index++) {
    const fipId = fipIds[index];
    const responseBody_ = await _request<discoverBanksResponseBody>({
      relativeUrl: `/GetFipDiscoverAndLinkedAccounts`,
      method: 'POST',
      body: {
        ...rest,
        I_FIPID: fipId,
        I_FIPNAME: fipNames[index],
      },
    });
    console.log('responseBody', responseBody_);
    responseBody = {
      ...responseBody,
      ...responseBody_,
      fip_DiscoverLinkedlist: [
        // ...responseBody.fip_DiscoverLinkedlist,
        ...(responseBody_.fip_DiscoverLinkedlist || []),
      ],
    };
  }
  return responseBody as discoverBanksResponseBody;
}
