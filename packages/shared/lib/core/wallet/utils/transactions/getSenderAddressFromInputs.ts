import { OUTPUT_TYPE_TREASURY, UNLOCK_CONDITION_ADDRESS, UNLOCK_CONDITION_EXPIRATION } from '../../constants'
import { IOutputResponse, IExpirationUnlockCondition, IAddressUnlockCondition } from '@iota/types'
import { getBech32AddressFromAddressTypes } from '../getBech32AddressFromAddressTypes'

export function getSenderAddressFromInputs(inputs: IOutputResponse[]): string {
    for (const { output, metadata } of inputs) {
        if (output.type !== OUTPUT_TYPE_TREASURY) {
            const { unlockConditions } = output

            const spentDate = metadata.milestoneTimestampSpent

            // A transaction with an expiration unlock condition is included if the transaction expired
            const expirationUnlockCondition = unlockConditions.find(
                (unlockCondition) =>
                    unlockCondition.type === UNLOCK_CONDITION_EXPIRATION && unlockCondition.unixTime < spentDate
            ) as IExpirationUnlockCondition
            if (expirationUnlockCondition) {
                return getBech32AddressFromAddressTypes(expirationUnlockCondition.returnAddress)
            }

            const addressUnlockCondition = unlockConditions.find(
                ({ type }) => type === UNLOCK_CONDITION_ADDRESS
            ) as IAddressUnlockCondition
            if (addressUnlockCondition) {
                return getBech32AddressFromAddressTypes(addressUnlockCondition.address)
            }
        }
    }
    return undefined
}
