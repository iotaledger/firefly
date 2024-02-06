import { CommonOutput, ExpirationUnlockCondition, UnlockConditionType } from '@iota/sdk/out/types'
import { getBech32AddressFromAddressTypes } from '../getBech32AddressFromAddressTypes'

export function getRecipientReturnAddressFromOutput(output: CommonOutput): string | undefined {
    for (const unlockCondition of output.unlockConditions) {
        if (unlockCondition.type === UnlockConditionType.Expiration) {
            const expirationUnlockCondition = unlockCondition as ExpirationUnlockCondition
            return getBech32AddressFromAddressTypes(expirationUnlockCondition.returnAddress)
        }
    }
}
