import { OUTPUT_TYPE_ALIAS, UNLOCK_CONDITION_STATE_CONTROLLER_ADDRESS } from '@core/wallet/constants'
import { OutputTypes, IStateControllerAddressUnlockCondition } from '@iota/types'
import { getBech32AddressFromAddressTypes } from '../getBech32AddressFromAddressTypes'

export function getStateControllerAddressFromOutput(output: OutputTypes): string {
    if (output && output.type === OUTPUT_TYPE_ALIAS) {
        const stateControllerUnlockCondition = output.unlockConditions.find(
            (unlockCondition) => unlockCondition.type === UNLOCK_CONDITION_STATE_CONTROLLER_ADDRESS
        ) as IStateControllerAddressUnlockCondition
        return getBech32AddressFromAddressTypes(stateControllerUnlockCondition.address)
    } else {
        return undefined
    }
}
