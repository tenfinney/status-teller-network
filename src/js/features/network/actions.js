import { INIT, UPDATE_BALANCES, UPDATE_BALANCE, GET_CONTACT_CODE, RESET_STATE, RESOLVE_ENS_NAME, PURGE_STATE } from './constants';

export const init = () => ({ type: INIT });
export const resetState = () => ({ type: RESET_STATE });
export const updateBalances = (address) => ({ type: UPDATE_BALANCES, address });
export const updateBalance = (symbol, address) => ({ type: UPDATE_BALANCE, symbol, address });
export const getContactCode = () => ({type: GET_CONTACT_CODE});
export const resolveENSName = (ens) => ({type: RESOLVE_ENS_NAME, ens});


export const clearCache = (cb) => {
  return {type: PURGE_STATE, result: cb};
};
