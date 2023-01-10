import type { OutputTypes, HexEncodedAmount } from '@iota/types';
import type { AccountSyncOptions, FilterOptions } from '../account';
import type {
    AddressWithAmount,
    AddressWithMicroAmount,
    AddressNativeTokens,
    AddressNftId,
    AddressGenerationOptions,
} from '../address';
import type {
    BuildAliasOutputData,
    BuildBasicOutputData,
    BuildFoundryOutputData,
    BuildNftOutputData,
} from '../buildOutputData';
import type { OutputOptions } from '../outputOptions';
import type { OutputsToClaim } from '../output';
import type { SignedTransactionEssence } from '../signedTransactionEssence';
import type { PreparedTransactionData } from '../preparedTransactionData';
import type {
    AliasOutputOptions,
    IncreaseNativeTokenSupplyOptions,
    NativeTokenOptions,
    TransactionOptions,
    NftOptions,
} from '../transactionOptions';

export type __BuildAliasOutputMethod__ = {
    name: 'buildAliasOutput';
    data: BuildAliasOutputData;
};

export type __BuildBasicOutputMethod__ = {
    name: 'buildBasicOutput';
    data: BuildBasicOutputData;
};

export type __BuildFoundryOutputMethod__ = {
    name: 'buildFoundryOutput';
    data: BuildFoundryOutputData;
};

export type __BuildNftOutputMethod__ = {
    name: 'buildNftOutput';
    data: BuildNftOutputData;
};

export type __BurnNativeTokenMethod__ = {
    name: 'burnNativeToken';
    data: {
        tokenId: string;
        burnAmount: HexEncodedAmount;
        options?: TransactionOptions;
    };
};

export type __BurnNftMethod__ = {
    name: 'burnNft';
    data: {
        nftId: string;
        options?: TransactionOptions;
    };
};

export type __ClaimOutputsMethod__ = {
    name: 'claimOutputs';
    data: {
        outputIdsToClaim: string[];
    };
};

export type __ConsolidateOutputsMethod__ = {
    name: 'consolidateOutputs';
    data: {
        force: boolean;
        outputConsolidationThreshold?: number;
    };
};

export type __CreateAliasOutputMethod__ = {
    name: 'createAliasOutput';
    data: {
        aliasOutputOptions?: AliasOutputOptions;
        options?: TransactionOptions;
    };
};

export type __DecreaseNativeTokenSupplyMethod__ = {
    name: 'decreaseNativeTokenSupply';
    data: {
        tokenId: string;
        meltAmount: HexEncodedAmount;
        options?: TransactionOptions;
    };
};

export type __DestroyAliasMethod__ = {
    name: 'destroyAlias';
    data: {
        aliasId: string;
        options?: TransactionOptions;
    };
};

export type __DestroyFoundryMethod__ = {
    name: 'destroyFoundry';
    data: {
        foundryId: string;
        options?: TransactionOptions;
    };
};

export type __GenerateAddressesMethod__ = {
    name: 'generateAddresses';
    data: {
        amount: number;
        options?: AddressGenerationOptions;
    };
};

export type __GetBalanceMethod__ = {
    name: 'getBalance';
};

export type __GetIncomingTransactionDataMethod__ = {
    name: 'getIncomingTransactionData';
    data: {
        transactionId: string;
    };
};

export type __GetOutputMethod__ = {
    name: 'getOutput';
    data: {
        outputId: string;
    };
};

export type __GetFoundryOutputMethod__ = {
    name: 'getFoundryOutput';
    data: {
        tokenId: string;
    };
};

export type __GetOutputsWithAdditionalUnlockConditionsMethod__ = {
    name: 'getOutputsWithAdditionalUnlockConditions';
    data: {
        outputsToClaim: OutputsToClaim;
    };
};

export type __GetTransactionMethod__ = {
    name: 'getTransaction';
    data: {
        transactionId: string;
    };
};

export type __AddressesMethod__ = {
    name: 'addresses';
};

export type __AddressesWithUnspentOutputsMethod__ = {
    name: 'addressesWithUnspentOutputs';
};

export type __OutputsMethod__ = {
    name: 'outputs';
    data: {
        filterOptions?: FilterOptions;
    };
};

export type __PendingTransactionsMethod__ = {
    name: 'pendingTransactions';
};

export type __IncomingTransactionsMethod__ = {
    name: 'incomingTransactions';
};

export type __TransactionsMethod__ = {
    name: 'transactions';
};

export type __UnspentOutputsMethod__ = {
    name: 'unspentOutputs';
    data: {
        filterOptions?: FilterOptions;
    };
};

export type __MinimumRequiredStorageDepositMethod__ = {
    name: 'minimumRequiredStorageDeposit';
    data: {
        output: OutputTypes;
    };
};

export type __IncreaseNativeTokenSupplyMethod__ = {
    name: 'increaseNativeTokenSupply';
    data: {
        tokenId: string;
        mintAmount: HexEncodedAmount;
        increaseNativeTokenSupplyOptions?: IncreaseNativeTokenSupplyOptions;
        options?: TransactionOptions;
    };
};

export type __MintNativeTokenMethod__ = {
    name: 'mintNativeToken';
    data: {
        nativeTokenOptions: NativeTokenOptions;
        options?: TransactionOptions;
    };
};

export type __MintNftsMethod__ = {
    name: 'mintNfts';
    data: {
        nftsOptions: NftOptions[];
        options?: TransactionOptions;
    };
};

export type __PrepareOutputMethod__ = {
    name: 'prepareOutput';
    data: {
        options: OutputOptions;
        transactionOptions?: TransactionOptions;
    };
};

export type __PrepareSendAmountMethod__ = {
    name: 'prepareSendAmount';
    data: {
        addressesWithAmount: AddressWithAmount[];
        options?: TransactionOptions;
    };
};

export type __PrepareTransactionMethod__ = {
    name: 'prepareTransaction';
    data: {
        outputs: OutputTypes[];
        options?: TransactionOptions;
    };
};

export type __RetryTransactionUntilIncludedMethod__ = {
    name: 'retryTransactionUntilIncluded';
    data: {
        transactionId: string;
        interval?: number;
        maxAttempts?: number;
    };
};

export type __SendAmountMethod__ = {
    name: 'sendAmount';
    data: {
        addressesWithAmount: AddressWithAmount[];
        options?: TransactionOptions;
    };
};

export type __SendMicroTransactionMethod__ = {
    name: 'sendMicroTransaction';
    data: {
        addressesWithMicroAmount: AddressWithMicroAmount[];
        options?: TransactionOptions;
    };
};

export type __SendNativeTokensMethod__ = {
    name: 'sendNativeTokens';
    data: {
        addressesNativeTokens: AddressNativeTokens[];
        options?: TransactionOptions;
    };
};

export type __SendNftMethod__ = {
    name: 'sendNft';
    data: {
        addressesAndNftIds: AddressNftId[];
        options?: TransactionOptions;
    };
};

export type __SendOutputsMethod__ = {
    name: 'sendOutputs';
    data: {
        outputs: OutputTypes[];
        options?: TransactionOptions;
    };
};

export type __SetAliasMethod__ = {
    name: 'setAlias';
    data: {
        alias: string;
    };
};

export type __SignTransactionEssenceMethod__ = {
    name: 'signTransactionEssence';
    data: {
        preparedTransactionData: PreparedTransactionData;
    };
};

export type __SubmitAndStoreTransactionMethod__ = {
    name: 'submitAndStoreTransaction';
    data: {
        signedTransactionData: SignedTransactionEssence;
    };
};

export type __SyncAccountMethod__ = {
    name: 'syncAccount';
    data: {
        options?: AccountSyncOptions;
    };
};

export type __VoteMethod__ = {
    name: 'vote';
    data: {
        eventId?: string;
        answers?: number[];
    };
};

export type __StopParticipatingMethod__ = {
    name: 'stopParticipating';
    data: {
        eventId: string;
    };
};

export type __GetVotingPowerMethod__ = {
    name: 'getVotingPower';
};

export type __GetParticipationOverviewMethod__ = {
    name: 'getParticipationOverview';
};

export type __IncreaseVotingPowerMethod__ = {
    name: 'increaseVotingPower';
    data: {
        amount: string;
    };
};

export type __DecreaseVotingPowerMethod__ = {
    name: 'decreaseVotingPower';
    data: {
        amount: string;
    };
};
