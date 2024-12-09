import { AnyAction } from 'redux';

import { AlreadyLinkedAccountsList, FipNewDiscoverelist } from '../../api/banks';
import { ADD_AUTHENTICATED_BANK } from '../types/bankListType';

export type AuthBankState = {
  authBanks: (FipNewDiscoverelist | AlreadyLinkedAccountsList)[];
};

const initialState: AuthBankState = {
  authBanks: [],
};

export default function authenticatedBanksReducer(
  state = initialState,
  action: AnyAction,
) {
  switch (action.type) {
    case ADD_AUTHENTICATED_BANK: {
      return { authBanks: state.authBanks.concat(action.body) };
    }
    default: {
      return state;
    }
  }
}
