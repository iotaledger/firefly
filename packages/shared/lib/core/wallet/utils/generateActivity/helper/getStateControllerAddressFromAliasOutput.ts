import { UNLOCK_CONDITION_STATE_CONTROLLER_ADDRESS } from '@core/wallet/constants'
import type { IStateControllerAddressUnlockCondition, IAliasOutput } from '@iota/types'
import { getBech32AddressFromAddressTypes } from '../../getBech32AddressFromAddressTypes'

export function getStateControllerAddressFromAliasOutput(output: IAliasOutput): string {
    const stateControllerUnlockCondition = output.unlockConditions.find(
        (unlockCondition) => unlockCondition.type === UNLOCK_CONDITION_STATE_CONTROLLER_ADDRESS
    ) as IStateControllerAddressUnlockCondition
    return getBech32AddressFromAddressTypes(stateControllerUnlockCondition.address)
}
