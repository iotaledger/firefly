import { OUTPUT_TYPE_ALIAS, UNLOCK_CONDITION_STATE_CONTROLLER_ADDRESS } from '@core/wallet/constants'
import { OutputTypes, IStateControllerAddressUnlockCondition, IEd25519Address } from '@iota/types'
import { convertEd25519ToBech32 } from '../convertEd25519ToBech32'

export function getStateControllerAddressFromOutput(output: OutputTypes): string {
    if (output && output?.type === OUTPUT_TYPE_ALIAS) {
        const stateControllerUnlockCondition = output.unlockConditions.find(
            (unlockCondition) => unlockCondition.type === UNLOCK_CONDITION_STATE_CONTROLLER_ADDRESS
        ) as IStateControllerAddressUnlockCondition
        return convertEd25519ToBech32((stateControllerUnlockCondition.address as IEd25519Address).pubKeyHash)
    } else {
        return undefined
    }
}
