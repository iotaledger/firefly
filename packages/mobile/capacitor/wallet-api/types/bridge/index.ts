import type { AccountId } from '../account';
import type {
    __BuildAliasOutputMethod__,
    __BuildBasicOutputMethod__,
    __BuildFoundryOutputMethod__,
    __BuildNftOutputMethod__,
    __BurnNativeTokenMethod__,
    __BurnNftMethod__,
    __ClaimOutputsMethod__,
    __ConsolidateOutputsMethod__,
    __CreateAliasOutputMethod__,
    __DecreaseNativeTokenSupplyMethod__,
    __DestroyAliasMethod__,
    __DestroyFoundryMethod__,
    __GenerateAddressesMethod__,
    __GetBalanceMethod__,
    __GetOutputMethod__,
    __GetFoundryOutputMethod__,
    __GetOutputsWithAdditionalUnlockConditionsMethod__,
    __GetTransactionMethod__,
    __AddressesMethod__,
    __AddressesWithUnspentOutputsMethod__,
    __OutputsMethod__,
    __PendingTransactionsMethod__,
    __IncomingTransactionsMethod__,
    __TransactionsMethod__,
    __UnspentOutputsMethod__,
    __MinimumRequiredStorageDepositMethod__,
    __IncreaseNativeTokenSupplyMethod__,
    __MintNativeTokenMethod__,
    __MintNftsMethod__,
    __PrepareOutputMethod__,
    __PrepareSendAmountMethod__,
    __PrepareTransactionMethod__,
    __RetryTransactionUntilIncludedMethod__,
    __SendAmountMethod__,
    __SendMicroTransactionMethod__,
    __SendNativeTokensMethod__,
    __SendNftMethod__,
    __SendOutputsMethod__,
    __SetAliasMethod__,
    __SignTransactionEssenceMethod__,
    __SubmitAndStoreTransactionMethod__,
    __SyncAccountMethod__,
    __GetIncomingTransactionDataMethod__,
    __VoteMethod__,
    __StopParticipatingMethod__,
    __GetVotingPowerMethod__,
    __GetParticipationOverviewMethod__,
    __IncreaseVotingPowerMethod__,
    __DecreaseVotingPowerMethod__,
} from './account';
import type {
    __BackupMessage__,
    __Bech32ToHex__,
    __ChangeStrongholdPasswordMessage__,
    __ClearStrongholdPasswordMessage__,
    __CreateAccountMessage__,
    __EmitTestEventMessage__,
    __GenerateMnemonicMessage__,
    __GetAccountMessage__,
    __GetAccountIndexesMessage__,
    __GetAccountsMessage__,
    __GetLedgerNanoStatusMessage__,
    __GenerateAddressMessage__,
    __GetNodeInfoMessage__,
    __HexToBech32__,
    __IsStrongholdPasswordAvailableMessage__,
    __RecoverAccountsMessage__,
    __RemoveLatestAccountMessage__,
    __RestoreBackupMessage__,
    __SetClientOptionsMessage__,
    __SetStrongholdPasswordClearIntervalMessage__,
    __SetStrongholdPasswordMessage__,
    __StartBackgroundSyncMessage__,
    __StopBackgroundSyncMessage__,
    __StoreMnemonicMessage__,
    __VerifyMnemonicMessage__,
    __DeregisterParticipationEvent__,
    __RegisterParticipationEventMessage__,
    __GetParticipationEventMessage__,
    __GetParticipationEventsMessage__,
    __GetParticipationEventStatusMessage__,
} from './accountManager';

export type __AccountMethod__ =
    | __BuildAliasOutputMethod__
    | __BuildBasicOutputMethod__
    | __BuildFoundryOutputMethod__
    | __BuildNftOutputMethod__
    | __BurnNativeTokenMethod__
    | __BurnNftMethod__
    | __ClaimOutputsMethod__
    | __ConsolidateOutputsMethod__
    | __CreateAliasOutputMethod__
    | __DestroyAliasMethod__
    | __DestroyFoundryMethod__
    | __GenerateAddressesMethod__
    | __GetBalanceMethod__
    | __GetOutputMethod__
    | __GetIncomingTransactionDataMethod__
    | __GetFoundryOutputMethod__
    | __GetOutputsWithAdditionalUnlockConditionsMethod__
    | __GetTransactionMethod__
    | __AddressesMethod__
    | __AddressesWithUnspentOutputsMethod__
    | __OutputsMethod__
    | __PendingTransactionsMethod__
    | __IncomingTransactionsMethod__
    | __TransactionsMethod__
    | __UnspentOutputsMethod__
    | __DecreaseNativeTokenSupplyMethod__
    | __MinimumRequiredStorageDepositMethod__
    | __IncreaseNativeTokenSupplyMethod__
    | __MintNativeTokenMethod__
    | __MintNftsMethod__
    | __PrepareOutputMethod__
    | __PrepareSendAmountMethod__
    | __PrepareTransactionMethod__
    | __RetryTransactionUntilIncludedMethod__
    | __SendAmountMethod__
    | __SendMicroTransactionMethod__
    | __SendNativeTokensMethod__
    | __SendNftMethod__
    | __SendOutputsMethod__
    | __SetAliasMethod__
    | __SignTransactionEssenceMethod__
    | __SubmitAndStoreTransactionMethod__
    | __SyncAccountMethod__
    | __VoteMethod__
    | __StopParticipatingMethod__
    | __GetVotingPowerMethod__
    | __GetParticipationOverviewMethod__
    | __IncreaseVotingPowerMethod__
    | __DecreaseVotingPowerMethod__;

export type __CallAccountMethodMessage__ = {
    cmd: 'callAccountMethod';
    payload: {
        accountId: AccountId;
        method: __AccountMethod__;
    };
};

export type __Message__ =
    | __BackupMessage__
    | __Bech32ToHex__
    | __CallAccountMethodMessage__
    | __ChangeStrongholdPasswordMessage__
    | __ClearStrongholdPasswordMessage__
    | __CreateAccountMessage__
    | __DeregisterParticipationEvent__
    | __EmitTestEventMessage__
    | __GenerateMnemonicMessage__
    | __GetAccountMessage__
    | __GetAccountIndexesMessage__
    | __GetAccountsMessage__
    | __GetLedgerNanoStatusMessage__
    | __GenerateAddressMessage__
    | __GetNodeInfoMessage__
    | __GetParticipationEventMessage__
    | __GetParticipationEventsMessage__
    | __GetParticipationEventStatusMessage__
    | __HexToBech32__
    | __IsStrongholdPasswordAvailableMessage__
    | __RecoverAccountsMessage__
    | __RegisterParticipationEventMessage__
    | __RemoveLatestAccountMessage__
    | __RestoreBackupMessage__
    | __SetClientOptionsMessage__
    | __SetStrongholdPasswordClearIntervalMessage__
    | __SetStrongholdPasswordMessage__
    | __StartBackgroundSyncMessage__
    | __StopBackgroundSyncMessage__
    | __StoreMnemonicMessage__
    | __VerifyMnemonicMessage__;

    