import { AliasOutput, StateControllerAddressUnlockCondition, UnlockConditionType } from '@iota/wallet/out/types'
import { getBech32AddressFromAddressTypes } from '../../getBech32AddressFromAddressTypes'

export function getStateControllerAddressFromAliasOutput(output: AliasOutput): string {
    const stateControllerUnlockCondition = output.unlockConditions.find(
        (unlockCondition) => unlockCondition.type === UnlockConditionType.StateControllerAddress
    ) as StateControllerAddressUnlockCondition
    return getBech32AddressFromAddressTypes(stateControllerUnlockCondition.address)
}
