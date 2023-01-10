import type { HexEncodedString, INativeToken } from '@iota/types';

/** Options for the creation of an output */
export interface OutputOptions {
    recipientAddress: string;
    amount: string;
    assets?: Assets;
    features?: Features;
    unlocks?: Unlocks;
    storageDeposit?: StorageDeposit;
}

/** Assets to include in the output */
export interface Assets {
    nativeTokens?: INativeToken[];
    nftId?: HexEncodedString;
}

/** Features to include in the output */
export interface Features {
    tag?: HexEncodedString;
    metadata?: HexEncodedString;
    sender?: string;
    issuer?: string;
}

/** Time unlocks to include in the output */
export interface Unlocks {
    expirationUnixTime?: number;
    timelockUnixTime?: number;
}

/** Storage deposit strategy to be used for the output */
export interface StorageDeposit {
    returnStrategy?: ReturnStrategy;
    useExcessIfLow?: boolean;
}

/** Return strategy for the storage deposit */
export enum ReturnStrategy {
    Return = 'Return',
    Gift = 'Gift',
}
