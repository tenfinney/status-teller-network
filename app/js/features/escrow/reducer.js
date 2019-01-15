import {
  CREATE_ESCROW_FAILED,
  CREATE_ESCROW_SUCCEEDED,
  GET_ESCROWS_SUCCEEDED,
  GET_ESCROWS_FAILED,
  GET_ESCROWS,
  RELEASE_ESCROW_SUCCEEDED,
  RELEASE_ESCROW_FAILED,
  CANCEL_ESCROW_FAILED,
  CANCEL_ESCROW_SUCCEEDED,
  RATE_TRANSACTION_FAILED, RATE_TRANSACTION_SUCCEEDED
} from './constants';
import cloneDeep from 'clone-deep';

const DEFAULT_STATE = {escrows: []};

const escrowBuilder = function (escrowObject) {
  return {
    escrowId: escrowObject.escrowId,
    buyer: escrowObject.buyer,
    seller: escrowObject.seller,
    expirationTime: escrowObject.expirationTime,
    amount: escrowObject.amount,
    released: false,
    canceled: false,
    paid: false,
    rating: 0
  };
};

function reducer(state = DEFAULT_STATE, action) {
  let escrows  = cloneDeep(state.escrows);
  switch (action.type) {
    case CREATE_ESCROW_FAILED:
      return {...state, ...{
          error: action.error,
          receipt: null
        }};
    case CREATE_ESCROW_SUCCEEDED:
      escrows.push(escrowBuilder(action.receipt.events.Created.returnValues));
      return {...state, ...{
          escrows: escrows,
          receipt: action.receipt,
          error: ''
        }};
    case GET_ESCROWS:
      return {...state, ...{
        loading: true
      }};
    case GET_ESCROWS_SUCCEEDED:
      return {...state, ...{
          escrows: action.escrows,
          loading: false
        }};
    case RELEASE_ESCROW_FAILED:
    case CANCEL_ESCROW_FAILED:
    case GET_ESCROWS_FAILED:
    case RATE_TRANSACTION_FAILED:
      return {...state, ...{
          errorGet: action.error,
          loading: false
        }};
    case RELEASE_ESCROW_SUCCEEDED:
      escrows[action.escrowId].released = true;
      return {...state, ...{
          escrows: escrows,
          errorGet: ''
        }};
    case CANCEL_ESCROW_SUCCEEDED:
      escrows[action.escrowId].canceled = true;
      return {...state, ...{
          escrows: escrows,
          errorGet: ''
        }};
    case RATE_TRANSACTION_SUCCEEDED:
      escrows[action.escrowId].rating = action.rating;
      return {...state, ...{
          escrows: escrows,
          errorGet: ''
        }};
    default:
      return state;
  }
}

export default reducer;