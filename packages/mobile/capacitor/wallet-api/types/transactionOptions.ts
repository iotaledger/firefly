import type { ITaggedDataPayload, HexEncodedAmount } from '@iota/types';

/** Options for the transaction creation */
export interface TransactionOptions {
    remainderValueStrategy?: RemainderValueStrategy;
    taggedDataPayload?: ITaggedDataPayload;
    /** Custom inputs that should be used for the transaction */
    customInputs?: string[];
    /** Optional note, that is only stored locally */
    note?: string;
}

/** The RemainderValueStrategy */
export type RemainderValueStrategy =
    | ChangeAddress
    | ReuseAddress
    | CustomAddress;

/** ChangeAddress variant of RemainderValueStrategy */
export type ChangeAddress = {
    strategy: 'ChangeAddress';
    value: null;
};

/** ReuseAddress variant of RemainderValueStrategy */
export type ReuseAddress = {
    strategy: 'ReuseAddress';
    value: null;
};

/** CustomAddress variant of RemainderValueStrategy */
export type CustomAddress = {
    strategy: 'CustomAddress';
    value: string;
};

/** Native token options for minting more native tokens */
export interface IncreaseNativeTokenSupplyOptions {}

/** Native token options for minting */
export interface NativeTokenOptions {
    aliasId?: string;
    /** Hex encoded number */
    circulatingSupply: HexEncodedAmount;
    /** Hex encoded number */
    maximumSupply: HexEncodedAmount;
    /** Hex encoded bytes */
    foundryMetadata?: string;
}

/** Nft options for minting */
export interface NftOptions {
    /** Bech32 encoded address to which the Nft will be minted. Default will use the
     * first address of the account
     */
    address?: string;
    /** Bech32 encoded sender address **/
    sender?: string;
    /** Hex encoded bytes */
    metadata?: string;
    /** Hex encoded bytes */
    tag?: string;
    /** Bech32 encoded issuer address **/
    issuer?: string;
    /** Hex encoded bytes */
    immutableMetadata?: string;
}

/** Options for the alias output creation */
export interface AliasOutputOptions {
    /** Bech32 encoded address to which the Nft will be minted. Default will use the
     * first address of the account
     */
    address?: string;
    /** Hex encoded bytes */
    immutableMetadata?: string;
    /** Hex encoded bytes */
    metadata?: string;
    /** Hex encoded bytes */
    stateMetadata?: string;
}
