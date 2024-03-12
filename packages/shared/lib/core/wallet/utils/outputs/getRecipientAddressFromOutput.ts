import { AddressUnlockCondition, CommonOutput, UnlockConditionType } from '@iota/sdk/out/types'
import { AddressConverter } from '../AddressConverter'

export function getRecipientAddressFromOutput(output: CommonOutput): string | undefined {
    for (const unlockCondition of output.unlockConditions) {
        if (unlockCondition.type === UnlockConditionType.Address) {
            const addressUnlockCondition = unlockCondition as AddressUnlockCondition
            return AddressConverter.addressToBech32(addressUnlockCondition.address)
        }
    }
}
