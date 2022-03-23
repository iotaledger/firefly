import { MessageResponse, ResponseTypes } from '@lib/typings/bridge'
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
            [ResponseTypes.InvalidMessage]: this.createBaseValidator()
                .add(new PayloadTypeValidator('object'))
                .getFirst(),
            [ResponseTypes.StrongholdPasswordSet]: this.createBaseValidator().getFirst(),
            [ResponseTypes.RemovedAccount]: this.createBaseValidator()
                .add(new PayloadTypeValidator('string'))
                .getFirst(),
            [ResponseTypes.CreatedAccount]: this.createBaseValidator().add(new AccountValidator()).getFirst(),
            [ResponseTypes.ReadAccounts]: this.createBaseValidator().add(new AccountListValidator()).getFirst(),
            [ResponseTypes.ReadAccount]: this.createBaseValidator().add(new AccountValidator()).getFirst(),

            [ResponseTypes.Balance]: this.createBaseValidator().add(new PayloadTypeValidator('object')).getFirst(),
            [ResponseTypes.BackupRestored]: this.createBaseValidator().getFirst(),
            [ResponseTypes.BackupSuccessful]: this.createBaseValidator().getFirst(),
            [ResponseTypes.GeneratedMnemonic]: this.createBaseValidator()
                .add(new PayloadTypeValidator('string'))
                .add(new MnemonicValidator())
                .getFirst(),
            [ResponseTypes.StoredMnemonic]: this.createBaseValidator().getFirst(),
            [ResponseTypes.VerifiedMnemonic]: this.createBaseValidator().getFirst(),
            [ResponseTypes.SyncedAccounts]: this.createBaseValidator().add(new SyncedAccountListValidator()).getFirst(),
            [ResponseTypes.Ok]: this.createBaseValidator().getFirst(),
            [ResponseTypes.SentTransfer]: this.createBaseValidator().add(new MessageValidator()).getFirst(),
            [ResponseTypes.StoragePasswordSet]: this.createBaseValidator().getFirst(),
            [ResponseTypes.StrongholdStatus]: this.createBaseValidator()
                .add(new StrongholdStatusValidator())
                .getFirst(),
            [ResponseTypes.GeneratedAddress]: this.createBaseValidator().add(new AddressValidator()).getFirst(),
            [ResponseTypes.LatestAddress]: this.createBaseValidator().add(new AddressValidator()).getFirst(),
            [ResponseTypes.SyncedAccount]: this.createBaseValidator().add(new SyncedAccountValidator()).getFirst(),
            [ResponseTypes.UnusedAddress]: this.createBaseValidator().add(new AddressValidator()).getFirst(),
            [ResponseTypes.IsLatestAddressUnused]: this.createBaseValidator()
                .add(new PayloadTypeValidator('boolean'))
                .getFirst(),
            [ResponseTypes.AreAllLatestAddressesUnused]: this.createBaseValidator()
                .add(new PayloadTypeValidator('boolean'))
                .getFirst(),
            [ResponseTypes.UpdatedAlias]: this.createBaseValidator().getFirst(),
            [ResponseTypes.DeletedStorage]: this.createBaseValidator().getFirst(),
            [ResponseTypes.LockedStronghold]: this.createBaseValidator().getFirst(),
            [ResponseTypes.StrongholdPasswordChanged]: this.createBaseValidator().getFirst(),
            [ResponseTypes.UpdatedAllClientOptions]: this.createBaseValidator().getFirst(),
            [ResponseTypes.LedgerStatus]: this.createBaseValidator().add(new LedgerDeviceStatusValidator()).getFirst(),
            [ResponseTypes.StrongholdPasswordClearIntervalSet]: this.createBaseValidator().getFirst(),
            [ResponseTypes.NodeInfo]: this.createBaseValidator().add(new NodeInfoValidator()).getFirst(),
            [ResponseTypes.Error]: this.createBaseValidator().getFirst(),
            [ResponseTypes.Panic]: this.createBaseValidator().getFirst(),

            // Legacy seed APIs
            [ResponseTypes.LegacySeedChecksum]: this.createBaseValidator().getFirst(),
            [ResponseTypes.LegacyAddressChecksum]: this.createBaseValidator().getFirst(),

            // Migration
            [ResponseTypes.MigrationData]: this.createBaseValidator().add(new MigrationDataValidator()).getFirst(),
            [ResponseTypes.CreatedMigrationBundle]: this.createBaseValidator().getFirst(),
            [ResponseTypes.SentMigrationBundle]: this.createBaseValidator().getFirst(),
            [ResponseTypes.MigrationAddress]: this.createBaseValidator().getFirst(),
            [ResponseTypes.MinedBundle]: this.createBaseValidator().getFirst(),
            [ResponseTypes.MineBundle]: this.createBaseValidator().getFirst(),

            // Participation
            [ResponseTypes.ParticipationOverview]: this.createBaseEventValidator().getFirst(),
            [ResponseTypes.EventsData]: this.createBaseEventValidator().getFirst(),
            [ResponseTypes.SentParticipation]: this.createBaseEventValidator().getFirst(),

            // Events
            [ResponseTypes.StrongholdStatusChange]: this.createBaseEventValidator().getFirst(),
            [ResponseTypes.NewTransaction]: this.createBaseEventValidator().getFirst(),
            [ResponseTypes.ErrorThrown]: this.createBaseEventValidator().getFirst(),
            [ResponseTypes.InvalidMessage]: this.createBaseValidator().getFirst(),
            [ResponseTypes.BalanceChange]: this.createBaseEventValidator().getFirst(),
            [ResponseTypes.ConfirmationStateChange]: this.createBaseEventValidator().getFirst(),
            [ResponseTypes.TransferProgress]: this.createBaseEventValidator().getFirst(),
            [ResponseTypes.LedgerAddressGeneration]: this.createBaseEventValidator().getFirst(),
            [ResponseTypes.MigrationProgress]: this.createBaseEventValidator().getFirst(),
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
     * @param {MessageResponse} response
     *
     * @returns {ValidationResponse}
     */
    performValidation(
        response: MessageResponse | MarketDataValidationResponse | ChrysalisVariablesValidationResponse
    ): ValidationResponse {
        return this.validators[response.type].isValid(response)
    }
}
