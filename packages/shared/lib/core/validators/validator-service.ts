import { BridgeResponses, BridgeResponseType } from '@core/actor'
import { MarketDataValidationResponse } from '@lib/typings/market'
import { ChrysalisVariablesValidationResponse } from '@lib/migration'

import { ValidationResponse } from './types'
import {
    AccountListValidator,
    AccountValidator,
    ActionValidator,
    AddressValidator,
    IdValidator,
    LedgerDeviceStatusValidator,
    MessageValidator,
    MigrationDataValidator,
    MnemonicValidator,
    NodeInfoValidator,
    PayloadTypeValidator,
    StrongholdStatusValidator,
    SyncedAccountListValidator,
    SyncedAccountValidator,
    TypeValidator,
} from './validator'
import { ValidatorChainBuilder } from './validator-chain-builder'

export class ValidatorService {
    validators: unknown
    ids: string[]

    constructor(ids?: string[]) {
        this.ids = ids

        this.validators = {
            [BridgeResponseType.InvalidMessage]: this.createBaseValidator()
                .add(new PayloadTypeValidator('object'))
                .getFirst(),
            [BridgeResponseType.StrongholdPasswordSet]: this.createBaseValidator().getFirst(),
            [BridgeResponseType.RemovedAccount]: this.createBaseValidator()
                .add(new PayloadTypeValidator('string'))
                .getFirst(),
            [BridgeResponseType.CreatedAccount]: this.createBaseValidator().add(new AccountValidator()).getFirst(),
            [BridgeResponseType.ReadAccounts]: this.createBaseValidator().add(new AccountListValidator()).getFirst(),
            [BridgeResponseType.ReadAccount]: this.createBaseValidator().add(new AccountValidator()).getFirst(),

            [BridgeResponseType.Balance]: this.createBaseValidator().add(new PayloadTypeValidator('object')).getFirst(),
            [BridgeResponseType.BackupRestored]: this.createBaseValidator().getFirst(),
            [BridgeResponseType.BackupSuccessful]: this.createBaseValidator().getFirst(),
            [BridgeResponseType.GeneratedMnemonic]: this.createBaseValidator()
                .add(new PayloadTypeValidator('string'))
                .add(new MnemonicValidator())
                .getFirst(),
            [BridgeResponseType.StoredMnemonic]: this.createBaseValidator().getFirst(),
            [BridgeResponseType.VerifiedMnemonic]: this.createBaseValidator().getFirst(),
            [BridgeResponseType.SyncedAccounts]: this.createBaseValidator()
                .add(new SyncedAccountListValidator())
                .getFirst(),
            [BridgeResponseType.Ok]: this.createBaseValidator().getFirst(),
            [BridgeResponseType.SentTransfer]: this.createBaseValidator().add(new MessageValidator()).getFirst(),
            [BridgeResponseType.StoragePasswordSet]: this.createBaseValidator().getFirst(),
            [BridgeResponseType.StrongholdStatus]: this.createBaseValidator()
                .add(new StrongholdStatusValidator())
                .getFirst(),
            [BridgeResponseType.GeneratedAddress]: this.createBaseValidator().add(new AddressValidator()).getFirst(),
            [BridgeResponseType.LatestAddress]: this.createBaseValidator().add(new AddressValidator()).getFirst(),
            [BridgeResponseType.SyncedAccount]: this.createBaseValidator().add(new SyncedAccountValidator()).getFirst(),
            [BridgeResponseType.UnusedAddress]: this.createBaseValidator().add(new AddressValidator()).getFirst(),
            [BridgeResponseType.IsLatestAddressUnused]: this.createBaseValidator()
                .add(new PayloadTypeValidator('boolean'))
                .getFirst(),
            [BridgeResponseType.AreAllLatestAddressesUnused]: this.createBaseValidator()
                .add(new PayloadTypeValidator('boolean'))
                .getFirst(),
            [BridgeResponseType.UpdatedAlias]: this.createBaseValidator().getFirst(),
            [BridgeResponseType.DeletedStorage]: this.createBaseValidator().getFirst(),
            [BridgeResponseType.LockedStronghold]: this.createBaseValidator().getFirst(),
            [BridgeResponseType.StrongholdPasswordChanged]: this.createBaseValidator().getFirst(),
            [BridgeResponseType.UpdatedAllClientOptions]: this.createBaseValidator().getFirst(),
            [BridgeResponseType.LedgerStatus]: this.createBaseValidator()
                .add(new LedgerDeviceStatusValidator())
                .getFirst(),
            [BridgeResponseType.StrongholdPasswordClearIntervalSet]: this.createBaseValidator().getFirst(),
            [BridgeResponseType.NodeInfo]: this.createBaseValidator().add(new NodeInfoValidator()).getFirst(),
            [BridgeResponseType.Error]: this.createBaseValidator().getFirst(),
            [BridgeResponseType.Panic]: this.createBaseValidator().getFirst(),

            // Legacy seed APIs
            [BridgeResponseType.LegacySeedChecksum]: this.createBaseValidator().getFirst(),
            [BridgeResponseType.LegacyAddressChecksum]: this.createBaseValidator().getFirst(),

            // Migration
            [BridgeResponseType.MigrationData]: this.createBaseValidator().add(new MigrationDataValidator()).getFirst(),
            [BridgeResponseType.CreatedMigrationBundle]: this.createBaseValidator().getFirst(),
            [BridgeResponseType.SentMigrationBundle]: this.createBaseValidator().getFirst(),
            [BridgeResponseType.MigrationAddress]: this.createBaseValidator().getFirst(),
            [BridgeResponseType.MinedBundle]: this.createBaseValidator().getFirst(),
            [BridgeResponseType.MineBundle]: this.createBaseValidator().getFirst(),

            // Participation
            [BridgeResponseType.ParticipationOverview]: this.createBaseEventValidator().getFirst(),
            [BridgeResponseType.EventsData]: this.createBaseEventValidator().getFirst(),
            [BridgeResponseType.SentParticipation]: this.createBaseEventValidator().getFirst(),

            // Events
            [BridgeResponseType.StrongholdStatusChange]: this.createBaseEventValidator().getFirst(),
            [BridgeResponseType.NewTransaction]: this.createBaseEventValidator().getFirst(),
            [BridgeResponseType.ErrorThrown]: this.createBaseEventValidator().getFirst(),
            [BridgeResponseType.InvalidMessage]: this.createBaseValidator().getFirst(),
            [BridgeResponseType.BalanceChange]: this.createBaseEventValidator().getFirst(),
            [BridgeResponseType.ConfirmationStateChange]: this.createBaseEventValidator().getFirst(),
            [BridgeResponseType.TransferProgress]: this.createBaseEventValidator().getFirst(),
            [BridgeResponseType.LedgerAddressGeneration]: this.createBaseEventValidator().getFirst(),
            [BridgeResponseType.MigrationProgress]: this.createBaseEventValidator().getFirst(),
            // Market data
            MarketData: new ValidatorChainBuilder().add(new TypeValidator()).getFirst(),
            // Chrysalis github variables
            ChrysalisVariables: new ValidatorChainBuilder().add(new TypeValidator()).getFirst(),
        }
    }

    /**
     * Creates a base validator
     *
     * @method createBaseValidator
     *
     * @returns {ValidatorChainBuilder}
     */
    private createBaseValidator(): ValidatorChainBuilder {
        return new ValidatorChainBuilder()
            .add(new TypeValidator())
            .add(new IdValidator(this.ids))
            .add(new ActionValidator())
    }

    /**
     * Creates a base event validator
     *
     * @method createBaseEventValidator
     *
     * @returns {ValidatorChainBuilder}
     */
    private createBaseEventValidator(): ValidatorChainBuilder {
        return new ValidatorChainBuilder().add(new TypeValidator()).add(new IdValidator(this.ids))
    }

    /**
     * Performs validation
     *
     * @method performValidation
     *
     * @param {BridgeResponses} response
     *
     * @returns {ValidationResponse}
     */
    performValidation(
        response: BridgeResponses | MarketDataValidationResponse | ChrysalisVariablesValidationResponse
    ): ValidationResponse {
        return this.validators[response.type].isValid(response)
    }
}
