import type { ITransactionPayload } from '@iota/types';

/** Possible InclusionStates of transactions sent with the wallet */
export enum InclusionState {
    /** The transaction is pending */
    Pending = 'Pending',
    /** The transaction is confirmed */
    Confirmed = 'Confirmed',
    /** The transaction is conflicting */
    Conflicting = 'Conflicting',
    /** The transaction and its in- and outputs are pruned, so it's unknown if it got confirmed or was conflicting */
    UnknownPruned = 'UnknownPruned',
}

/** A Transaction with metadata */
export interface Transaction {
    /** The transaction payload */
    payload: ITransactionPayload;
    /** The block id in which the transaction payload was included */
    blockId?: string;
    /** The inclusion state of the transaction */
    inclusionState: InclusionState;
    /** The creation time */
    timestamp: string;
    /** The transaction id */
    transactionId: string;
    /** The network id in which the transaction was sent */
    networkId: string;
    /** If the transaction was created by the wallet or someone else */
    incoming: boolean;
    note?: string;
}

/** The result of a minting operation */
export interface MintTokenTransaction {
    /** The token id of the minted token */
    tokenId: string;
    /** The transaction which minted the token */
    transaction: Transaction;
}
