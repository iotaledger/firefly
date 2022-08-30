import { Subject } from '../../types'
import { OUTPUT_TYPE_TREASURY, UNLOCK_CONDITION_ADDRESS, UNLOCK_CONDITION_EXPIRATION } from '../../constants'
import { convertEd25519ToBech32 } from '../convertEd25519ToBech32'
import { getSubjectFromAddress } from '../getSubjectFromAddress'
import {
    AddressTypes,
    IOutputResponse,
    IExpirationUnlockCondition,
    IEd25519Address,
    IAddressUnlockCondition,
} from '@iota/types'

export function getSenderFromInputs(inputs: IOutputResponse[]): Subject {
    for (const { output } of inputs) {
        // TODO: currently getSubjectFromEd25519 only handles basic outputs
        // We need to add a wrapper function to handle alias, NFT and Foundry outputs
        if (output.type !== OUTPUT_TYPE_TREASURY) {
            const { unlockConditions } = output

            const expirationUnlockCondition = unlockConditions.find(
                ({ type }) => type === UNLOCK_CONDITION_EXPIRATION
            ) as IExpirationUnlockCondition
            if (expirationUnlockCondition) {
                return getSubjectFromEd25519(expirationUnlockCondition.returnAddress)
            }

            const addressUnlockCondition = unlockConditions.find(
                ({ type }) => type === UNLOCK_CONDITION_ADDRESS
            ) as IAddressUnlockCondition
            if (addressUnlockCondition) {
                return getSubjectFromEd25519(addressUnlockCondition.address)
            }
        }
    }
    return undefined
}

function getSubjectFromEd25519(address: AddressTypes): Subject {
    const ed25519Address = address as IEd25519Address
    const bech32Address = convertEd25519ToBech32(ed25519Address.pubKeyHash)
    return getSubjectFromAddress(bech32Address)
}
