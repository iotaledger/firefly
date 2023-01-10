import type {
    AddressTypes,
    OutputTypes,
    IOutputMetadataResponse,
} from '@iota/types';

/** Output to claim */
export enum OutputsToClaim {
    None = 'None',
    MicroTransactions = 'MicroTransactions',
    NativeTokens = 'NativeTokens',
    Nfts = 'Nfts',
    All = 'All',
}

/** An output with metadata */
export interface OutputData {
    /** The identifier of an Output */
    outputId: OutputId;
    /** The metadata of the output */
    metadata: IOutputMetadataResponse;
    /** The actual Output */
    output: OutputTypes;
    /** If an output is spent */
    isSpent: boolean;
    /** Associated account address */
    address: AddressTypes;
    /** Network ID */
    networkId: string;
    /** Remainder */
    remainder: boolean;
    /** BIP32 path */
    chain?: Segment[];
}

/** A Segment of the BIP32 path*/
export interface Segment {
    hardened: boolean;
    bs: Uint8Array;
}

export type OutputId = string;
