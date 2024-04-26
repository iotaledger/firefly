import { AddressUnlockCondition, CommonOutput, ImmutableAccountAddressUnlockCondition, UnlockConditionType } from '@iota/sdk/out/types'
import { AddressConverter } from '../AddressConverter'

export function getRecipientAddressFromOutput(output: CommonOutput): string | undefined {
    for (const unlockCondition of output.unlockConditions) {
        if ([UnlockConditionType.Address, UnlockConditionType.ImmutableAccountAddress].includes(unlockCondition.type)) {
            const addressUnlockCondition = unlockCondition as AddressUnlockCondition | ImmutableAccountAddressUnlockCondition
            return AddressConverter.addressToBech32(addressUnlockCondition.address)
        }
    }
}
