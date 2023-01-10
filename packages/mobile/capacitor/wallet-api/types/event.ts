import type { IOutputResponse, ITransactionPayload } from '@iota/types';
import type { OutputData } from './output';

/** Wallet event types */
export type EventType =
    | '*'
    | 'ConsolidationRequired'
    | 'LedgerAddressGeneration'
    | 'NewOutput'
    | 'SpentOutput'
    | 'TransactionInclusion'
    | 'TransactionProgress';

export type NewOutputEvent = {
    output: OutputData;
    transaction?: ITransactionPayload;
    transactionInputs?: IOutputResponse;
};

/** Wallet events */
export enum WalletEvent {
    ConsolidationRequired = 'ConsolidationRequired',
    LedgerAddressGeneration = 'LedgerAddressGeneration',
    NewOutput = 'NewOutput',
    SpentOutput = 'SpentOutput',
    TransactionInclusion = 'TransactionInclusion',
    TransactionProgress = 'TransactionProgress',
}
