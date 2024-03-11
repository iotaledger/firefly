import { AnchorOutput, StateControllerAddressUnlockCondition, UnlockConditionType } from '@iota/sdk/out/types'
import { AddressConverter } from '../../AddressConverter'

export function getStateControllerAddressFromAnchorOutput(output: AnchorOutput): string {
    const stateControllerUnlockCondition = output.unlockConditions.find(
        (unlockCondition) => unlockCondition.type === UnlockConditionType.StateControllerAddress
    ) as StateControllerAddressUnlockCondition
    return AddressConverter.addressToBech32(stateControllerUnlockCondition.address)
}
