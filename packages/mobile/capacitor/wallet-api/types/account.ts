import type { Address, AddressWithUnspentOutputs } from './address';
import type { OutputData } from './output';
import type { Transaction } from './transaction';
import type {
    HexEncodedAmount,
    IOutputResponse,
    ITransactionPayload,
} from '@iota/types';

/**
 * Account identifier
 * Could be the account index (number) or account alias (string)
 */
export type AccountId = number | string;

/** The balance of an account */
export interface AccountBalance {
    /**  The balance of the base coin */
    baseCoin: BaseCoinBalance;
    /** The required storage deposit for the outputs */
    requiredStorageDeposit: RequiredStorageDeposit;
    /** The balance of the native tokens */
    nativeTokens: NativeTokenBalance[];
    /** Nft outputs */
    nfts: string[];
    /** Alias outputs */
    aliases: string[];
    /** Foundry outputs */
    foundries: string[];
    /**
     * Outputs with multiple unlock conditions and if they can currently be spent or not. If there is a
     * TimelockUnlockCondition or ExpirationUnlockCondition this can change at any time
     */
    potentiallyLockedOutputs: { [outputId: string]: boolean };
}

/** The balance of the base coin */
export interface BaseCoinBalance {
    /** The total amount of the outputs */
    total: string;
    /** The amount of the outputs that aren't used in a transaction */
    available: string;
}

/** The required storage deposit per output type */
export interface RequiredStorageDeposit {
    alias: string;
    basic: string;
    foundry: string;
    nft: string;
}

/** The balance of a native token */
export interface NativeTokenBalance {
    tokenId: string;
    total: HexEncodedAmount;
    available: HexEncodedAmount;
}

/** Sync options for an account */
export interface AccountSyncOptions {
    /**
     * Specific Bech32 encoded addresses of the account to sync, if addresses are provided,
     * then `address_start_index` will be ignored
     */
    addresses?: string[];
    /**
     * Address index from which to start syncing addresses. 0 by default, using a higher index will be faster because
     * addresses with a lower index will be skipped, but could result in a wrong balance for that reason
     */
    addressStartIndex?: number;
    /**
     * Address index from which to start syncing internal addresses. 0 by default, using a higher index will be faster
     * because addresses with a lower index will be skipped, but could result in a wrong balance for that reason
     */
    addressStartIndexInternal?: number;
    /**
     * Usually syncing is skipped if it's called in between 200ms, because there can only be new changes every
     * milestone and calling it twice "at the same time" will not return new data
     * When this to true, we will sync anyways, even if it's called 0ms after the las sync finished. Default: false.
     */
    forceSyncing?: boolean;
    /// Try to sync transactions from incoming outputs with their inputs. Some data may not be obtained if it has been
    /// pruned.
    syncIncomingTransactions?: boolean;
    /** Checks pending transactions and promotes/reattaches them if necessary.  Default: true. */
    syncPendingTransactions?: boolean;
    /** Specifies if only basic outputs should be synced or also alias and nft outputs. Default: true. */
    syncAliasesAndNfts?: boolean;
    /** Specifies if only basic outputs with an AddressUnlockCondition alone should be synced, will overwrite
     * `syncAliasesAndNfts`. Default: false. */
    syncOnlyMostBasicOutputs?: boolean;
}

/** The account object */
export interface AccountMeta {
    index: number;
    coinType: CoinType;
    alias: string;
    publicAddresses: Address[];
    internalAddresses: Address[];
    addressesWithUnspentOutputs: AddressWithUnspentOutputs[];
    outputs: { [outputId: string]: OutputData };
    /** Output IDs of unspent outputs that are currently used as input for transactions */
    lockedOutputs: Set<string>;
    unspentOutputs: { [outputId: string]: OutputData };
    transactions: { [transactionId: string]: Transaction };
    /** Transaction IDs of pending transactions */
    pendingTransactions: Set<string>;
    /** Incoming transactions with their inputs if available and not already pruned */
    incomingTransactions: {
        [transactionId: string]: [ITransactionPayload, IOutputResponse[]];
    };
}

/** The account metadata */
export interface AccountMetadata {
    /** The account alias */
    alias: string;
    /** The used coin type */
    coinType: CoinType;
    /** The account index which will be used in the BIP32 path */
    index: number;
}

/** IOTA and Shimmer coin types */
export enum CoinType {
    IOTA = 4218,
    Shimmer = 4219,
}

/** Options for account creation */
export interface CreateAccountPayload {
    alias?: string;
    bech32Hrp?: string;
}

/** Options to filter outputs */
export interface FilterOptions {
    /** Filter all outputs where the booked milestone index is below the specified timestamp */
    lowerBoundBookedTimestamp?: number;
    /** Filter all outputs where the booked milestone index is above the specified timestamp */
    upperBoundBookedTimestamp?: number;
    /** Filter all outputs for the provided types (Basic = 3, Alias = 4, Foundry = 5, NFT = 6) */
    outputTypes?: Uint8Array;
}
