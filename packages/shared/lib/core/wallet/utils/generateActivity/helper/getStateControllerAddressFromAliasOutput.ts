import { AliasOutput, StateControllerAddressUnlockCondition, UnlockConditionType } from '@iota/wallet'
import { getBech32AddressFromAddressTypes } from '../../getBech32AddressFromAddressTypes'

export function getStateControllerAddressFromAliasOutput(output: AliasOutput): string {
    const stateControllerUnlockCondition = output
        .getUnlockConditions()
        .find(
            (unlockCondition) => unlockCondition.getType() === UnlockConditionType.StateControllerAddress
        ) as StateControllerAddressUnlockCondition
    return getBech32AddressFromAddressTypes(stateControllerUnlockCondition.getAddress())
}
