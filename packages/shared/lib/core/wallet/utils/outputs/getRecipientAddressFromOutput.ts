import { AddressUnlockCondition, CommonOutput, UnlockConditionType } from '@iota/sdk/out/types'
import { getBech32AddressFromAddressTypes } from '../getBech32AddressFromAddressTypes'

export function getRecipientAddressFromOutput(output: CommonOutput): string | undefined {
    for (const unlockCondition of output.unlockConditions) {
        if (unlockCondition.type === UnlockConditionType.Address) {
            const addressUnlockCondition = unlockCondition as AddressUnlockCondition
            return getBech32AddressFromAddressTypes(addressUnlockCondition.address)
        }
    }
}
