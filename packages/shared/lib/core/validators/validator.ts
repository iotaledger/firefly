import { BridgeResponses } from '@core/actor'
import { Account, SyncedAccount } from '@lib/typings/account'
import { Message } from '@lib/typings/message'
import { Address } from '@lib/typings/address'
import { StrongholdStatus } from '@lib/typings/wallet'
import { LedgerStatus } from '@lib/typings/ledger'
import { MigrationData } from '@lib/typings/migration'
import { NodeInfo } from '@lib/typings/node'

import { ValidationError } from './enums'
import { ValidationErrorPayload, ValidationResponse } from './types'

export type Validators =
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

export class Validator {
    nextValidator: Validators

    /**
     * Creates validaton response
     *
     * @method createResponse
     *
     * @param {boolean} isValid
     * @param {ValidationErrorPayload} error
     *
     * @returns {ValidationResponse}
     */
    createResponse(isValid: boolean, payload?: ValidationErrorPayload): ValidationResponse {
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
     * @param {BridgeResponses} response
     *
     * @returns {ValidationResponse}
     */
    isValid(response: BridgeResponses): ValidationResponse {
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
export class IdValidator extends Validator {
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
     * @param {BridgeResponses} response
     *
     * @returns {ValidationResponse}
     */
    isValid(response: BridgeResponses): ValidationResponse {
        const id = response?.id

        if ('string' !== typeof id) {
            return super.createResponse(false, {
                type: ValidationError.InvalidType,
                error: 'Invalid type of id received.',
            })
        }

        if (!this.ids.includes(id)) {
            return super.createResponse(false, {
                type: ValidationError.UnknownId,
                error: 'Unknown id.',
            })
        }

        return super.isValid(response)
    }
}

/**
 * Validation for action
 */
export class ActionValidator extends Validator {
    /**
     * Checks if response is valid
     *
     * @method isValid
     *
     * @param {BridgeResponses} response
     *
     * @returns {ValidationResponse}
     */
    isValid(response: BridgeResponses): ValidationResponse {
        const { action } = response

        if ('string' !== typeof action) {
            return super.createResponse(false, {
                type: ValidationError.InvalidType,
                error: 'Invalid type of action received.',
            })
        }

        return super.isValid(response)
    }
}

/**
 * Validation for account identifier
 */
export class PayloadTypeValidator extends Validator {
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
     * @param {BridgeResponses} response
     *
     * @returns {ValidationResponse}
     */
    isValid(response: BridgeResponses): ValidationResponse {
        const { payload } = response

        if (payload && typeof payload !== this.type) {
            return super.createResponse(false, {
                type: ValidationError.InvalidType,
                error: 'Invalid type of payload received.',
            })
        }

        return super.isValid(response)
    }
}

/**
 * Validation for accounts list
 */
export class AccountListValidator extends Validator {
    /**
     * Checks if response is valid
     *
     * @method isValid
     *
     * @param {BridgeResponses} response
     *
     * @returns {ValidationResponse}
     */
    isValid(response: BridgeResponses): ValidationResponse {
        const payload = response.payload as Account[]

        if (!Array.isArray(payload)) {
            return super.createResponse(false, {
                type: ValidationError.InvalidType,
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
export class SyncedAccountListValidator extends Validator {
    /**
     * Checks if response is valid
     *
     * @method isValid
     *
     * @param {BridgeResponses} response
     *
     * @returns {ValidationResponse}
     */
    isValid(response: BridgeResponses): ValidationResponse {
        const payload = response.payload as Account[]

        if (!Array.isArray(payload)) {
            return super.createResponse(false, {
                type: ValidationError.InvalidType,
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
export class SyncedAccountValidator extends Validator {
    /**
     * Checks if response is valid
     *
     * @method isValid
     *
     * @param {BridgeResponses} response
     *
     * @returns {ValidationResponse}
     */
    isValid(response: BridgeResponses): ValidationResponse {
        const payload = response.payload

        if ('string' !== typeof payload.id) {
            return super.createResponse(false, {
                type: ValidationError.InvalidType,
                error: 'Invalid type of id received.',
            })
        } else if ('object' !== typeof payload.depositAddress) {
            return super.createResponse(false, {
                type: ValidationError.InvalidType,
                error: 'Invalid type of depositAddress received.',
            })
        } else if ('boolean' !== typeof payload.isEmpty) {
            return super.createResponse(false, {
                type: ValidationError.InvalidType,
                error: 'Invalid type of isEmpty received.',
            })
        } else if (!Array.isArray(payload.messages)) {
            return super.createResponse(false, {
                type: ValidationError.InvalidType,
                error: 'Invalid type of messages received.',
            })
        } else if (!Array.isArray(payload.addresses)) {
            return super.createResponse(false, {
                type: ValidationError.InvalidType,
                error: 'Invalid type of addresses received.',
            })
        }

        return super.isValid(response)
    }
}

/**
 * Validation for account
 */
export class AccountValidator extends Validator {
    /**
     * Checks if response is valid
     *
     * @method isValid
     *
     * @param {BridgeResponses} response
     *
     * @returns {ValidationResponse}
     */
    isValid(response: BridgeResponses): ValidationResponse {
        const payload = response.payload

        if ('string' !== typeof payload.id) {
            return super.createResponse(false, {
                type: ValidationError.InvalidType,
                error: 'Invalid type of id received.',
            })
        } else if ('string' !== typeof payload.alias) {
            return super.createResponse(false, {
                type: ValidationError.InvalidType,
                error: 'Invalid type of alias received.',
            })
        } else if ('string' !== typeof payload.createdAt) {
            return super.createResponse(false, {
                type: ValidationError.InvalidType,
                error: 'Invalid type of createdAt received.',
            })
        } else if (!Array.isArray(payload.messages)) {
            return super.createResponse(false, {
                type: ValidationError.InvalidType,
                error: 'Invalid type of messages received.',
            })
        } else if (!Array.isArray(payload.addresses)) {
            return super.createResponse(false, {
                type: ValidationError.InvalidType,
                error: 'Invalid type of addresses received.',
            })
        }

        return super.isValid(response)
    }
}

/**
 * Validation for message
 */
export class MessageValidator extends Validator {
    /**
     * Checks if response is valid
     *
     * @method isValid
     *
     * @param {BridgeResponses} response
     *
     * @returns {ValidationResponse}
     */
    isValid(response: BridgeResponses): ValidationResponse {
        const payload = response.payload

        // TODO: Should we validate message version?

        if ('string' !== typeof payload.id) {
            return super.createResponse(false, {
                type: ValidationError.InvalidType,
                error: 'Invalid type of id received.',
            })
        } else if ('boolean' !== typeof payload.broadcasted) {
            return super.createResponse(false, {
                type: ValidationError.InvalidType,
                error: 'Invalid type of broadcasted received.',
            })
        } else if ('number' !== typeof payload.nonce) {
            return super.createResponse(false, {
                type: ValidationError.InvalidType,
                error: 'Invalid type of nonce received.',
            })
        } else if ('string' !== typeof payload.timestamp) {
            return super.createResponse(false, {
                type: ValidationError.InvalidType,
                error: 'Invalid type of timestamp received.',
            })
        }

        if (payload.parents.some((parent) => 'string' !== typeof parent)) {
            return super.createResponse(false, {
                type: ValidationError.InvalidType,
                error: 'Invalid type of parents received.',
            })
        }

        return super.isValid(response)
    }
}

/**
 * Validator for address
 */
export class AddressValidator extends Validator {
    /**
     * Checks if response is valid
     *
     * @method isValid
     *
     * @param {BridgeResponses} response
     *
     * @returns {ValidationResponse}
     */
    isValid(response: BridgeResponses): ValidationResponse {
        const payload = response.payload

        if ('string' !== typeof payload.address) {
            return super.createResponse(false, {
                type: ValidationError.InvalidType,
                error: 'Invalid type of address received.',
            })
        } else if ('number' !== typeof payload.balance) {
            return super.createResponse(false, {
                type: ValidationError.InvalidType,
                error: 'Invalid type of balance received.',
            })
        } else if ('number' !== typeof payload.keyIndex) {
            return super.createResponse(false, {
                type: ValidationError.InvalidType,
                error: 'Invalid type of keyIndex received.',
            })
        } else if ('boolean' !== typeof payload.internal) {
            return super.createResponse(false, {
                type: ValidationError.InvalidType,
                error: 'Invalid type of internal received.',
            })
        }

        return super.isValid(response)
    }
}

/**
 * Validation for generated mnemonic
 */
export class MnemonicValidator extends Validator {
    /**
     * Checks if response is valid
     *
     * @method isValid
     *
     * @param {BridgeResponses} response
     *
     * @returns {ValidationResponse}
     */
    isValid(response: BridgeResponses): ValidationResponse {
        const payload = response.payload as string

        if (payload.split(' ').length !== 24) {
            return super.createResponse(false, {
                type: ValidationError.InvalidType,
                error: 'Invalid mnemonic length received.',
            })
        }

        return super.isValid(response)
    }
}

/**
 * Validation for stronghold status
 */
export class StrongholdStatusValidator extends Validator {
    /**
     * Checks if response is valid
     *
     * @method isValid
     *
     * @param {BridgeResponses} response
     *
     * @returns {ValidationResponse}
     */
    isValid(response: BridgeResponses): ValidationResponse {
        const payload = response.payload

        if ('Locked' !== payload.snapshot.status && 'Unlocked' !== payload.snapshot.status) {
            return super.createResponse(false, {
                type: ValidationError.InvalidType,
                error: 'Invalid type of status received.',
            })
        }

        return super.isValid(response)
    }
}

/**
 * Validation for ledger device status
 */
export class LedgerDeviceStatusValidator extends Validator {
    /**
     * Checks if response is valid
     *
     * @method isValid
     *
     * @param {BridgeResponses} response
     *
     * @returns {ValidationResponse}
     */
    isValid(response: BridgeResponses): ValidationResponse {
        const payload = response.payload

        if ('boolean' !== typeof payload.connected && 'boolean' !== typeof payload.locked) {
            return super.createResponse(false, {
                type: ValidationError.InvalidType,
                error: 'Invalid type of status received.',
            })
        }

        return super.isValid(response)
    }
}

/**
 * Validation for responses with Ledger migration data
 */
export class MigrationDataValidator extends Validator {
    /**
     * Checks if migration data response is valid
     *
     * @method isValid
     *
     * @param {BridgeResponses} response
     *
     * @returns {ValidationResponse}
     */
    isValid(response: BridgeResponses): ValidationResponse {
        const payload = response.payload

        if ('number' !== typeof payload.lastCheckedAddressIndex) {
            return super.createResponse(false, {
                type: ValidationError.InvalidType,
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
export class TypeValidator extends Validator {
    /**
     * Checks if response is valid
     *
     * @method isValid
     *
     * @param {BridgeResponses} response
     *
     * @returns {ValidationResponse}
     */
    isValid(response: BridgeResponses): ValidationResponse {
        const hasValidType =
            'object' === typeof response &&
            null !== response &&
            !Array.isArray(response) &&
            'function' !== typeof response

        if (!hasValidType) {
            return super.createResponse(false, {
                type: ValidationError.InvalidType,
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
                type: ValidationError.EmptyResponse,
                error: 'Empty message received.',
            })
        }

        if (responseValues.some((value) => 'function' === typeof value)) {
            return super.createResponse(false, {
                type: ValidationError.InvalidType,
                error: 'Properties with invalid types received.',
            })
        }

        return super.isValid(response)
    }
}

/**
 * Validation for get node info
 */
export class NodeInfoValidator extends Validator {
    /**
     * Checks if response is valid
     *
     * @method isValid
     *
     * @param {BridgeResponses} response
     *
     * @returns {ValidationResponse}
     */
    isValid(response: BridgeResponses): ValidationResponse {
        const payload = response.payload

        if (!payload.nodeinfo || 'object' !== typeof payload.nodeinfo) {
            return super.createResponse(false, {
                type: ValidationError.InvalidType,
                error: 'No node info.',
            })
        } else if ('string' !== typeof payload.url) {
            return super.createResponse(false, {
                type: ValidationError.InvalidType,
                error: 'No node url.',
            })
        } else if ('string' !== typeof payload.nodeinfo.version) {
            return super.createResponse(false, {
                type: ValidationError.InvalidType,
                error: 'Invalid type of node info version.',
            })
        } else if ('string' !== typeof payload.nodeinfo.networkId) {
            return super.createResponse(false, {
                type: ValidationError.InvalidType,
                error: 'Invalid type of node info network id.',
            })
        } else if ('boolean' !== typeof payload.nodeinfo.isHealthy) {
            return super.createResponse(false, {
                type: ValidationError.InvalidType,
                error: 'Invalid type of node info is healthy.',
            })
        } else if ('string' !== typeof payload.nodeinfo.bech32HRP) {
            return super.createResponse(false, {
                type: ValidationError.InvalidType,
                error: 'Invalid type of node info bech 32 hrp.',
            })
        } else if ('number' !== typeof payload.nodeinfo.minPoWScore) {
            return super.createResponse(false, {
                type: ValidationError.InvalidType,
                error: 'Invalid type of node info min pow score.',
            })
        } else if ('number' !== typeof payload.nodeinfo.latestMilestoneIndex) {
            return super.createResponse(false, {
                type: ValidationError.InvalidType,
                error: 'Invalid type of node info latest milestone index.',
            })
        } else if ('number' !== typeof payload.nodeinfo.latestMilestoneTimestamp) {
            return super.createResponse(false, {
                type: ValidationError.InvalidType,
                error: 'Invalid type of node info latest milestone timestamp.',
            })
        } else if ('number' !== typeof payload.nodeinfo.confirmedMilestoneIndex) {
            return super.createResponse(false, {
                type: ValidationError.InvalidType,
                error: 'Invalid type of node info confirmed milestone index.',
            })
        } else if ('number' !== typeof payload.nodeinfo.pruningIndex) {
            return super.createResponse(false, {
                type: ValidationError.InvalidType,
                error: 'Invalid type of node info latest pruning index.',
            })
        } else if (!Array.isArray(payload.nodeinfo.features)) {
            return super.createResponse(false, {
                type: ValidationError.InvalidType,
                error: 'Invalid type of node info features.',
            })
        } else if ('number' !== typeof payload.nodeinfo.messagesPerSecond) {
            return super.createResponse(false, {
                type: ValidationError.InvalidType,
                error: 'Invalid type of node info messages per second.',
            })
        } else if ('number' !== typeof payload.nodeinfo.referencedMessagesPerSecond) {
            return super.createResponse(false, {
                type: ValidationError.InvalidType,
                error: 'Invalid type of node info referenced messages per second.',
            })
        } else if ('number' !== typeof payload.nodeinfo.referencedRate) {
            return super.createResponse(false, {
                type: ValidationError.InvalidType,
                error: 'Invalid type of node info referenced rate.',
            })
        }

        return super.isValid(response)
    }
}
