import { ChrysalisVariablesValidationResponse } from 'shared/lib/migration'
import { Account, SyncedAccount } from './typings/account'
import { Address } from './typings/address'
import { MessageResponse } from './typings/bridge'
import { ResponseTypes } from './typings/bridge'
import { LedgerStatus } from './typings/ledger'
import { Message } from './typings/message'
import { MigrationData } from './typings/migration'
import { NodeInfo } from './typings/node'
import { StrongholdStatus } from './typings/wallet'
import { ErrorObject, ValidationResponse } from './typings/validator'
import { ErrorTypes } from './typings/validator'
import { MarketDataValidationResponse } from './typings/market'

type Validators =
    | IdValidator
    | ActionValidator
    | PayloadTypeValidator
    | AccountValidator
    | AccountListValidator
    | SyncedAccountValidator
    | SyncedAccountListValidator
    | MessageValidator
    | StrongholdStatusValidator
    | AddressValidator
    | NodeInfoValidator

class Validator {
    nextValidator: Validators

    /**
     * Creates validaton response
     *
     * @method createResponse
     *
     * @param {boolean} isValid
     * @param {ErrorObject} error
     *
     * @returns {ValidationResponse}
     */
    createResponse(isValid: boolean, payload?: ErrorObject): ValidationResponse {
        return {
            isValid,
            payload,
        }
    }

    /**
     * Checks if response is valid
     *
     * @method isValid
     *
     * @param {MessageResponse} response
     *
     * @returns {ValidationResponse}
     */
    isValid(response: MessageResponse): ValidationResponse {
        if (this.nextValidator != null) {
            return this.nextValidator.isValid(response)
        }

        return this.createResponse(true)
    }

    /**
     * Sets next validator
     *
     * @method setNextValidator
     *
     * @param {Validators} validator
     *
     * @returns {ValidationResponse}
     */
    setNextValidator(validator: Validators): void {
        this.nextValidator = validator
    }
}

/**
 * Validation for (channel) id
 */
class IdValidator extends Validator {
    ids: string[]

    /**
     * @param {string[]} ids
     *
     * @returns {IdValidator}
     */
    constructor(ids: string[]) {
        super()

        this.ids = ids
        return this
    }

    /**
     * Checks if response is valid
     *
     * @method isValid
     *
     * @param {MessageResponse} response
     *
     * @returns {ValidationResponse}
     */
    isValid(response: MessageResponse): ValidationResponse {
        const id = response?.id

        if ('string' !== typeof id) {
            return super.createResponse(false, {
                type: ErrorTypes.InvalidType,
                error: 'Invalid type of id received.',
            })
        }

        if (!this.ids.includes(id)) {
            return super.createResponse(false, {
                type: ErrorTypes.UnknownId,
                error: 'Unknown id.',
            })
        }

        return super.isValid(response)
    }
}

/**
 * Validation for action
 */
class ActionValidator extends Validator {
    /**
     * Checks if response is valid
     *
     * @method isValid
     *
     * @param {MessageResponse} response
     *
     * @returns {ValidationResponse}
     */
    isValid(response: MessageResponse): ValidationResponse {
        const { action } = response

        if ('string' !== typeof action) {
            return super.createResponse(false, {
                type: ErrorTypes.InvalidType,
                error: 'Invalid type of action received.',
            })
        }

        return super.isValid(response)
    }
}

/**
 * Validation for account identifier
 */
class PayloadTypeValidator extends Validator {
    type: string

    constructor(type: string) {
        super()
        this.type = type
    }

    /**
     * Checks if response is valid
     *
     * @method isValid
     *
     * @param {MessageResponse} response
     *
     * @returns {ValidationResponse}
     */
    isValid(response: MessageResponse): ValidationResponse {
        const { payload } = response

        if (payload && typeof payload !== this.type) {
            return super.createResponse(false, {
                type: ErrorTypes.InvalidType,
                error: 'Invalid type of payload received.',
            })
        }

        return super.isValid(response)
    }
}

/**
 * Validation for accounts list
 */
class AccountListValidator extends Validator {
    /**
     * Checks if response is valid
     *
     * @method isValid
     *
     * @param {MessageResponse} response
     *
     * @returns {ValidationResponse}
     */
    isValid(response: MessageResponse): ValidationResponse {
        const payload = response.payload as Account[]

        if (!Array.isArray(payload)) {
            return super.createResponse(false, {
                type: ErrorTypes.InvalidType,
                error: 'Invalid type of accounts received.',
            })
        }

        for (const account of payload) {
            const validationResponse = new AccountValidator().isValid(
                Object.assign({}, response, {
                    payload: account,
                })
            )
            if (!validationResponse.isValid) {
                return validationResponse
            }
        }

        return super.isValid(response)
    }
}

/**
 * Validation for synced accounts list
 */
class SyncedAccountListValidator extends Validator {
    /**
     * Checks if response is valid
     *
     * @method isValid
     *
     * @param {MessageResponse} response
     *
     * @returns {ValidationResponse}
     */
    isValid(response: MessageResponse): ValidationResponse {
        const payload = response.payload as Account[]

        if (!Array.isArray(payload)) {
            return super.createResponse(false, {
                type: ErrorTypes.InvalidType,
                error: 'Invalid type of synced accounts received.',
            })
        }

        for (const account of payload) {
            const validationResponse = new SyncedAccountValidator().isValid(
                Object.assign({}, response, {
                    payload: account,
                })
            )

            if (!validationResponse.isValid) {
                return validationResponse
            }
        }

        return super.isValid(response)
    }
}

/**
 * Validation for synced account
 */
class SyncedAccountValidator extends Validator {
    /**
     * Checks if response is valid
     *
     * @method isValid
     *
     * @param {MessageResponse} response
     *
     * @returns {ValidationResponse}
     */
    isValid(response: MessageResponse): ValidationResponse {
        const payload = response.payload as SyncedAccount

        if ('string' !== typeof payload.id) {
            return super.createResponse(false, {
                type: ErrorTypes.InvalidType,
                error: 'Invalid type of id received.',
            })
        } else if ('object' !== typeof payload.depositAddress) {
            return super.createResponse(false, {
                type: ErrorTypes.InvalidType,
                error: 'Invalid type of depositAddress received.',
            })
        } else if ('boolean' !== typeof payload.isEmpty) {
            return super.createResponse(false, {
                type: ErrorTypes.InvalidType,
                error: 'Invalid type of isEmpty received.',
            })
        } else if (!Array.isArray(payload.messages)) {
            return super.createResponse(false, {
                type: ErrorTypes.InvalidType,
                error: 'Invalid type of messages received.',
            })
        } else if (!Array.isArray(payload.addresses)) {
            return super.createResponse(false, {
                type: ErrorTypes.InvalidType,
                error: 'Invalid type of addresses received.',
            })
        }

        return super.isValid(response)
    }
}

/**
 * Validation for account
 */
class AccountValidator extends Validator {
    /**
     * Checks if response is valid
     *
     * @method isValid
     *
     * @param {MessageResponse} response
     *
     * @returns {ValidationResponse}
     */
    isValid(response: MessageResponse): ValidationResponse {
        const payload = response.payload as Account

        if ('string' !== typeof payload.id) {
            return super.createResponse(false, {
                type: ErrorTypes.InvalidType,
                error: 'Invalid type of id received.',
            })
        } else if ('string' !== typeof payload.alias) {
            return super.createResponse(false, {
                type: ErrorTypes.InvalidType,
                error: 'Invalid type of alias received.',
            })
        } else if ('string' !== typeof payload.createdAt) {
            return super.createResponse(false, {
                type: ErrorTypes.InvalidType,
                error: 'Invalid type of createdAt received.',
            })
        } else if (!Array.isArray(payload.messages)) {
            return super.createResponse(false, {
                type: ErrorTypes.InvalidType,
                error: 'Invalid type of messages received.',
            })
        } else if (!Array.isArray(payload.addresses)) {
            return super.createResponse(false, {
                type: ErrorTypes.InvalidType,
                error: 'Invalid type of addresses received.',
            })
        }

        return super.isValid(response)
    }
}

/**
 * Validation for message
 */
class MessageValidator extends Validator {
    /**
     * Checks if response is valid
     *
     * @method isValid
     *
     * @param {MessageResponse} response
     *
     * @returns {ValidationResponse}
     */
    isValid(response: MessageResponse): ValidationResponse {
        const payload = response.payload as Message

        // TODO: Should we validate message version?

        if ('string' !== typeof payload.id) {
            return super.createResponse(false, {
                type: ErrorTypes.InvalidType,
                error: 'Invalid type of id received.',
            })
        } else if ('boolean' !== typeof payload.broadcasted) {
            return super.createResponse(false, {
                type: ErrorTypes.InvalidType,
                error: 'Invalid type of broadcasted received.',
            })
        } else if ('number' !== typeof payload.nonce) {
            return super.createResponse(false, {
                type: ErrorTypes.InvalidType,
                error: 'Invalid type of nonce received.',
            })
        } else if ('string' !== typeof payload.timestamp) {
            return super.createResponse(false, {
                type: ErrorTypes.InvalidType,
                error: 'Invalid type of timestamp received.',
            })
        }

        if (payload.parents.some((parent) => 'string' !== typeof parent)) {
            return super.createResponse(false, {
                type: ErrorTypes.InvalidType,
                error: 'Invalid type of parents received.',
            })
        }

        return super.isValid(response)
    }
}

/**
 * Validator for address
 */
class AddressValidator extends Validator {
    /**
     * Checks if response is valid
     *
     * @method isValid
     *
     * @param {MessageResponse} response
     *
     * @returns {ValidationResponse}
     */
    isValid(response: MessageResponse): ValidationResponse {
        const payload = response.payload as Address

        if ('string' !== typeof payload.address) {
            return super.createResponse(false, {
                type: ErrorTypes.InvalidType,
                error: 'Invalid type of address received.',
            })
        } else if ('number' !== typeof payload.balance) {
            return super.createResponse(false, {
                type: ErrorTypes.InvalidType,
                error: 'Invalid type of balance received.',
            })
        } else if ('number' !== typeof payload.keyIndex) {
            return super.createResponse(false, {
                type: ErrorTypes.InvalidType,
                error: 'Invalid type of keyIndex received.',
            })
        } else if ('boolean' !== typeof payload.internal) {
            return super.createResponse(false, {
                type: ErrorTypes.InvalidType,
                error: 'Invalid type of internal received.',
            })
        }

        return super.isValid(response)
    }
}

/**
 * Validation for generated mnemonic
 */
class MnemonicValidator extends Validator {
    /**
     * Checks if response is valid
     *
     * @method isValid
     *
     * @param {MessageResponse} response
     *
     * @returns {ValidationResponse}
     */
    isValid(response: MessageResponse): ValidationResponse {
        const payload = response.payload as string

        if (payload.split(' ').length !== 24) {
            return super.createResponse(false, {
                type: ErrorTypes.InvalidType,
                error: 'Invalid mnemonic length received.',
            })
        }

        return super.isValid(response)
    }
}

/**
 * Validation for stronghold status
 */
class StrongholdStatusValidator extends Validator {
    /**
     * Checks if response is valid
     *
     * @method isValid
     *
     * @param {MessageResponse} response
     *
     * @returns {ValidationResponse}
     */
    isValid(response: MessageResponse): ValidationResponse {
        const payload = response.payload as StrongholdStatus

        if ('Locked' !== payload.snapshot.status && 'Unlocked' !== payload.snapshot.status) {
            return super.createResponse(false, {
                type: ErrorTypes.InvalidType,
                error: 'Invalid type of status received.',
            })
        }

        return super.isValid(response)
    }
}

/**
 * Validation for ledger device status
 */
class LedgerDeviceStatusValidator extends Validator {
    /**
     * Checks if response is valid
     *
     * @method isValid
     *
     * @param {MessageResponse} response
     *
     * @returns {ValidationResponse}
     */
    isValid(response: MessageResponse): ValidationResponse {
        const payload = response.payload as LedgerStatus

        if ('boolean' !== typeof payload.connected && 'boolean' !== typeof payload.locked) {
            return super.createResponse(false, {
                type: ErrorTypes.InvalidType,
                error: 'Invalid type of status received.',
            })
        }

        return super.isValid(response)
    }
}

/**
 * Validation for responses with Ledger migration data
 */
class MigrationDataValidator extends Validator {
    /**
     * Checks if migration data response is valid
     *
     * @method isValid
     *
     * @param {MessageResponse} response
     *
     * @returns {ValidationResponse}
     */
    isValid(response: MessageResponse): ValidationResponse {
        const payload = response.payload as MigrationData

        if ('number' !== typeof payload.lastCheckedAddressIndex) {
            return super.createResponse(false, {
                type: ErrorTypes.InvalidType,
                error: 'Invalid type of address index',
            })
        }

        return super.isValid(response)
    }
}

/**
 * Validation for type of response object
 * Type should be the very first thing that gets validated
 */
class TypeValidator extends Validator {
    /**
     * Checks if response is valid
     *
     * @method isValid
     *
     * @param {MessageResponse} response
     *
     * @returns {ValidationResponse}
     */
    isValid(response: MessageResponse): ValidationResponse {
        const hasValidType =
            'object' === typeof response &&
            null !== response &&
            !Array.isArray(response) &&
            'function' !== typeof response

        if (!hasValidType) {
            return super.createResponse(false, {
                type: ErrorTypes.InvalidType,
                error: 'Invalid type of message received.',
            })
        }

        const getValues = (obj, results = []) => {
            const r = results

            const values = Array.isArray(obj) ? obj : Object.values(obj)

            values.forEach((value) => {
                if ('object' !== typeof value) {
                    r.push(value)
                }

                if (value && 'object' === typeof value) {
                    getValues(value, r)
                }
            })

            return r
        }

        const responseValues = getValues(response)

        if (!responseValues.length) {
            return super.createResponse(false, {
                type: ErrorTypes.EmptyResponse,
                error: 'Empty message received.',
            })
        }

        if (responseValues.some((value) => 'function' === typeof value)) {
            return super.createResponse(false, {
                type: ErrorTypes.InvalidType,
                error: 'Properties with invalid types received.',
            })
        }

        return super.isValid(response)
    }
}

/**
 * Validation for get node info
 */
class NodeInfoValidator extends Validator {
    /**
     * Checks if response is valid
     *
     * @method isValid
     *
     * @param {MessageResponse} response
     *
     * @returns {ValidationResponse}
     */
    isValid(response: MessageResponse): ValidationResponse {
        const payload = response.payload as NodeInfo

        if (!payload.nodeinfo || 'object' !== typeof payload.nodeinfo) {
            return super.createResponse(false, {
                type: ErrorTypes.InvalidType,
                error: 'No node info.',
            })
        } else if ('string' !== typeof payload.url) {
            return super.createResponse(false, {
                type: ErrorTypes.InvalidType,
                error: 'No node url.',
            })
        } else if ('string' !== typeof payload.nodeinfo.version) {
            return super.createResponse(false, {
                type: ErrorTypes.InvalidType,
                error: 'Invalid type of node info version.',
            })
        } else if ('string' !== typeof payload.nodeinfo.networkId) {
            return super.createResponse(false, {
                type: ErrorTypes.InvalidType,
                error: 'Invalid type of node info network id.',
            })
        } else if ('boolean' !== typeof payload.nodeinfo.isHealthy) {
            return super.createResponse(false, {
                type: ErrorTypes.InvalidType,
                error: 'Invalid type of node info is healthy.',
            })
        } else if ('string' !== typeof payload.nodeinfo.bech32HRP) {
            return super.createResponse(false, {
                type: ErrorTypes.InvalidType,
                error: 'Invalid type of node info bech 32 hrp.',
            })
        } else if ('number' !== typeof payload.nodeinfo.minPoWScore) {
            return super.createResponse(false, {
                type: ErrorTypes.InvalidType,
                error: 'Invalid type of node info min pow score.',
            })
        } else if ('number' !== typeof payload.nodeinfo.latestMilestoneIndex) {
            return super.createResponse(false, {
                type: ErrorTypes.InvalidType,
                error: 'Invalid type of node info latest milestone index.',
            })
        } else if ('number' !== typeof payload.nodeinfo.latestMilestoneTimestamp) {
            return super.createResponse(false, {
                type: ErrorTypes.InvalidType,
                error: 'Invalid type of node info latest milestone timestamp.',
            })
        } else if ('number' !== typeof payload.nodeinfo.confirmedMilestoneIndex) {
            return super.createResponse(false, {
                type: ErrorTypes.InvalidType,
                error: 'Invalid type of node info confirmed milestone index.',
            })
        } else if ('number' !== typeof payload.nodeinfo.pruningIndex) {
            return super.createResponse(false, {
                type: ErrorTypes.InvalidType,
                error: 'Invalid type of node info latest pruning index.',
            })
        } else if (!Array.isArray(payload.nodeinfo.features)) {
            return super.createResponse(false, {
                type: ErrorTypes.InvalidType,
                error: 'Invalid type of node info features.',
            })
        } else if ('number' !== typeof payload.nodeinfo.messagesPerSecond) {
            return super.createResponse(false, {
                type: ErrorTypes.InvalidType,
                error: 'Invalid type of node info messages per second.',
            })
        } else if ('number' !== typeof payload.nodeinfo.referencedMessagesPerSecond) {
            return super.createResponse(false, {
                type: ErrorTypes.InvalidType,
                error: 'Invalid type of node info referenced messages per second.',
            })
        } else if ('number' !== typeof payload.nodeinfo.referencedRate) {
            return super.createResponse(false, {
                type: ErrorTypes.InvalidType,
                error: 'Invalid type of node info referenced rate.',
            })
        }

        return super.isValid(response)
    }
}

class ValidatorChainBuilder {
    first: Validators
    last: Validators

    /**
     * Adds a new validation to the validation chain
     *
     * @method add
     *
     * @param {Validators} validator
     *
     * @returns {ValidatorChainBuilder}
     */
    add(validator: Validators): ValidatorChainBuilder {
        if (!this.first) {
            this.first = validator
            this.last = validator
        } else {
            this.last.setNextValidator(validator)
            this.last = validator
        }

        return this
    }

    /**
     * Gets first validator in chain
     *
     * @method getFirst
     *
     * @returns {Validators}
     */
    getFirst(): Validators {
        return this.first
    }
}

export default class ValidatorService {
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
