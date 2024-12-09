import { combineReducers } from 'redux';

import { BankState } from '../types/bankListType';
import { AuthState } from '../types/login';
import authReducer from './auth-reducer';
import authenticatedBanksReducer from './authenticatedBanksReducer';
import { AuthBankState } from './authenticatedBanksReducer';
import bankListReducer from './bankListReducer';

export interface RootStateType {
  auth: AuthState;
  bank: BankState;
  authBanks: AuthBankState;
}

export const rootReducer = combineReducers({
  auth: authReducer,
  bank: bankListReducer,
  authBanks: authenticatedBanksReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
