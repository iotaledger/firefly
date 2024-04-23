import { CommonOutput, UnlockConditionType, AddressUnlockCondition } from '@iota/sdk/out/types'
import { AddressConverter } from './AddressConverter'

export function isOutputUnlockedByAddress(output: CommonOutput, address: string): boolean {
    const outputAddress = (
        output.unlockConditions.find(
            (unlockCondition) => unlockCondition.type === UnlockConditionType.Address
        ) as AddressUnlockCondition
    ).address
    const bech32Address = AddressConverter.addressToBech32(outputAddress)
    return bech32Address === address
}
