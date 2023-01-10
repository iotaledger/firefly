import type { ITransactionPayload } from '@iota/types';
import type { InputSigningData } from './preparedTransactionData';

/** The signed transaction with inputs data  */
export interface SignedTransactionEssence {
    transactionPayload: ITransactionPayload;
    inputsData: InputSigningData;
}
