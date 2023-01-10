import type {
    FeatureTypes,
    INativeToken,
    TokenSchemeTypes,
    UnlockConditionTypes,
} from '@iota/types';

/** An alias output */
export interface BuildAliasOutputData extends BuildBasicOutputData {
    aliasId: string;
    stateIndex?: number;
    stateMetadata?: Uint8Array;
    foundryCounter?: number;
    immutableFeatures?: FeatureTypes[];
}

/** A basic output */
export interface BuildBasicOutputData {
    /** If not provided, minimum storage deposit will be used */
    amount?: string;
    nativeTokens?: INativeToken;
    unlockConditions: UnlockConditionTypes[];
    features?: FeatureTypes[];
}

/** A foundry output */
export interface BuildFoundryOutputData extends BuildBasicOutputData {
    serialNumber: number;
    tokenScheme: TokenSchemeTypes;
    immutableFeatures?: FeatureTypes[];
}

/** An nft output */
export interface BuildNftOutputData extends BuildBasicOutputData {
    nftId: string;
    immutableFeatures?: FeatureTypes[];
}
