import { Subject } from '../../types'
import { OUTPUT_TYPE_TREASURY, UNLOCK_CONDITION_ADDRESS, UNLOCK_CONDITION_EXPIRATION } from '../../constants'
import { getSubjectFromAddress } from '../getSubjectFromAddress'
import { AddressTypes, IOutputResponse, IExpirationUnlockCondition, IAddressUnlockCondition } from '@iota/types'
import { getBech32AddressFromAddressTypes } from '../getBech32AddressFromAddressTypes'

export function getSenderFromInputs(inputs: IOutputResponse[]): Subject {
    for (const { output } of inputs) {
        if (output.type !== OUTPUT_TYPE_TREASURY) {
            const { unlockConditions } = output

            // A transaction with an expiration unlock condition is included if the transaction expired
            const expirationUnlockCondition = unlockConditions.find(
                ({ type }) => type === UNLOCK_CONDITION_EXPIRATION
            ) as IExpirationUnlockCondition
            if (expirationUnlockCondition) {
                return getSubjectFromAddressTypes(expirationUnlockCondition.returnAddress)
            }

            const addressUnlockCondition = unlockConditions.find(
                ({ type }) => type === UNLOCK_CONDITION_ADDRESS
            ) as IAddressUnlockCondition
            if (addressUnlockCondition) {
                return getSubjectFromAddressTypes(addressUnlockCondition.address)
            }
        }
    }
    return undefined
}

function getSubjectFromAddressTypes(address: AddressTypes): Subject {
    const bech32Address = getBech32AddressFromAddressTypes(address)
    return getSubjectFromAddress(bech32Address)
}
