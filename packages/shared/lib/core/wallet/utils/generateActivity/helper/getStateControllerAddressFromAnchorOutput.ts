import { AnchorOutput, StateControllerAddressUnlockCondition, UnlockConditionType } from '@iota/sdk/out/types'
import { getBech32AddressFromAddressTypes } from '../../getBech32AddressFromAddressTypes'

export function getStateControllerAddressFromAnchorOutput(output: AnchorOutput): string {
    const stateControllerUnlockCondition = output.unlockConditions.find(
        (unlockCondition) => unlockCondition.type === UnlockConditionType.StateControllerAddress
    ) as StateControllerAddressUnlockCondition
    return getBech32AddressFromAddressTypes(stateControllerUnlockCondition.address)
}
