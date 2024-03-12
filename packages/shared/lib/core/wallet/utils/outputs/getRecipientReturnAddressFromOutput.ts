import { CommonOutput, ExpirationUnlockCondition, UnlockConditionType } from '@iota/sdk/out/types'
import { AddressConverter } from '../AddressConverter'

export function getRecipientReturnAddressFromOutput(output: CommonOutput): string | undefined {
    for (const unlockCondition of output.unlockConditions) {
        if (unlockCondition.type === UnlockConditionType.Expiration) {
            const expirationUnlockCondition = unlockCondition as ExpirationUnlockCondition
            return AddressConverter.addressToBech32(expirationUnlockCondition.returnAddress)
        }
    }
}
