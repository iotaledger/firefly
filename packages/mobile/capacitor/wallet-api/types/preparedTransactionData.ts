import type {
    AddressTypes,
    IOutputMetadataResponse,
    ITransactionEssence,
    OutputTypes,
} from '@iota/types';
import type { Segment } from './output';

/**
 * Prepared transaction data, useful for offline signing.
 */
export interface PreparedTransactionData {
    /**
     * Transaction essence
     */
    essence: ITransactionEssence;
    /**
     * Required address information for signing
     */
    inputsData: InputSigningData[];
    /**
     * Optional remainder output information
     */
    remainder?: RemainderData;
}

/**
 * Data for transaction inputs for signing and ordering of unlock blocks
 */
export interface InputSigningData {
    /**
     * The output
     */
    output: OutputTypes;
    /**
     * The output metadata
     */
    outputMetaData: IOutputMetadataResponse;
    /**
     * The chain derived from seed, only for ed25519 addresses
     */
    chain?: Segment[];
    /**
     * The bech32 encoded address, required because of alias outputs where we have multiple possible unlock
     * conditions, because we otherwise don't know which one we need
     */
    bech32Address: string;
}

/**
 * Data for a remainder output, used for ledger nano
 */
export interface RemainderData {
    /**
     * The remainder output
     */
    output: OutputTypes;
    /**
     * The chain derived from seed, for the remainder addresses
     */
    chain?: Segment[];
    /**
     * The remainder address
     */
    address: AddressTypes;
}
