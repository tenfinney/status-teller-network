import Escrow from 'Embark/contracts/Escrow';
import {INCLUDE_SIGNATURE, SIGNATURE_OPEN_CASE, SIGNATURE_PAYMENT} from './constants';

export const includeSignature = ({type, escrowId, message}) => {
  let method;
  switch(type){
    case SIGNATURE_PAYMENT:
      method = 'pay(uint256,bytes)';
      break;
    case SIGNATURE_OPEN_CASE:
      method = 'openCase(uint256,bytes)';
      break;
    default:
      throw new Error("Invalid signature type");
  }
  return { type: INCLUDE_SIGNATURE, toSend: Escrow.methods[method](escrowId, message) };
};
