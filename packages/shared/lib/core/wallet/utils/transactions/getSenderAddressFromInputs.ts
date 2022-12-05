import { IWrappedOutput } from '@core/wallet/interfaces'
import { IAddressUnlockCondition, IExpirationUnlockCondition } from '@iota/types'
import { UNLOCK_CONDITION_ADDRESS, UNLOCK_CONDITION_EXPIRATION } from '../../constants'
import { getBech32AddressFromAddressTypes } from '../getBech32AddressFromAddressTypes'

export function getSenderAddressFromInputs(inputs: IWrappedOutput[]): string {
    for (const input of inputs) {
        if (input) {
            const { output, metadata } = input
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
