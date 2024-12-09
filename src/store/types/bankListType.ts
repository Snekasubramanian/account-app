import { BankListResponseBody, SelectedBankType } from '../../api/banks';

export const BANK_LIST = 'BANK_LIST';
export const ADD_NEW_NUMBER = 'ADD_NEW_NUMBER';

export const DISCOVER_REQUEST = 'DISCOVER_REQUEST';
export const DISCOVER_REPONSE = 'DISCOVER_REPONSE';
export const DISCOVER_REQUEST_SUCCESS = 'DISCOVER_REQUEST_SUCCESS';

export const ADD_SELECTED_BANK_LIST = 'ADD_SELECTED_BANK_LIST';
export const SET_CONSUMER_DETAILS = 'SET_CONSUMER_DETAILS';
export const REMOVE_SELECTED_BANK_LIST = 'REMOVE_SELECTED_BANK_LIST';

export const LINK_ACCOUNT_SUCCESS = 'LINK_ACCOUNT_SUCCESS';
export const LINK_ACCOUNT_AUTHENTICATE_SUCCESS = 'LINK_ACCOUNT_AUTHENTICATE_SUCCESS';
export const PROVIDE_CONSENT_SUCCESS = 'PROVIDE_CONSENT_SUCCESS';

export const ADD_AUTHENTICATED_BANK = 'ADD_AUTHENTICATED_BANK';

export type BankState = {
  bankList: BankListResponseBody | any;
  selectedBank: SelectedBankType;
  discoverBankResponse:any;
  consumer: any;
};
