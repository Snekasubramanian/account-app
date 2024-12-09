import { AnyAction } from 'redux';

import { IndBank } from '../../api/banks';
import {
  ADD_SELECTED_BANK_LIST,
  BANK_LIST,
  BankState,
  DISCOVER_REPONSE,
  REMOVE_SELECTED_BANK_LIST,
  SET_CONSUMER_DETAILS,
} from '../types/bankListType';
import { eventTracker } from '../../lib/helper';

const initialState: BankState = {
  bankList: null,
  selectedBank: {},
  discoverBankResponse:{},
  consumer: { logo: '', consumer_id: '', purpose: '' },
};

export default function bankListReducer(state = initialState, action: AnyAction) {
  switch (action.type) {
    case BANK_LIST: {
      const Banks = action.body.map((acc: any, i:any) => {
        if(i == 0){
          return { ...acc, isChecked: true };
        }else{
          return { ...acc, isChecked: false };
        }
      });
      return { ...state, bankList: Banks };
    }
    case DISCOVER_REPONSE:{
      return { ...state,discoverBankResponse:action.body};
    }
    case ADD_SELECTED_BANK_LIST: {
      const existingBanks = (state.selectedBank[action.number] as Array<IndBank>) || [];
      const selectedBank = {
        ...state.selectedBank,
        [action.number]: existingBanks.concat(action.body),
      };

      return {
        ...state,
        selectedBank: selectedBank,
      };
    }
    case REMOVE_SELECTED_BANK_LIST: {
      return {
        ...state,
        selectedBank: { ...state.selectedBank, [action.number]: [] },
      };
    }
    case SET_CONSUMER_DETAILS:
      return {
        ...state,
        consumer: action.consumer_data,
      };

    case 'SELECT_ACCOUNT': {
      const { selectedAccount } = action.body;
      const accounts = state.bankList;
      const isChecked =
        accounts &&
        accounts.find((acc: any) => acc.FIPACCREFNUM === selectedAccount.FIPACCREFNUM)
          ?.isChecked;
      const updatedAccounts = accounts.map((acc: any) => {
        if (acc.FIPACCREFNUM === selectedAccount.FIPACCREFNUM) {
          return { ...acc, isChecked: true };
        }else{
          return { ...acc, isChecked: false }; 
        }
      });
      if(selectedAccount.isChecked){
        eventTracker('RLending_BankStatementLinkAccountFlow', { 
          action: 'account_deselected', 
          screen: 'link_account_screen', 
          account_type: selectedAccount.Linked ? 'linked_account' : 'unlinked_account',
          bank_name: selectedAccount.FIPNAME,
          count_of_accounts: updatedAccounts.length,
          })
      }else{
        eventTracker('RLending_BankStatementLinkAccountFlow', { 
          action: 'account_selected', 
          screen: 'link_account_screen', 
          account_type: selectedAccount.Linked ? 'linked_account' : 'unlinked_account',
          bank_name: selectedAccount.FIPNAME,
          count_of_accounts: updatedAccounts.length,
          })
          
      }
      return { ...state, bankList: updatedAccounts };
    }
    default: {
      return state;
    }
  }
}
