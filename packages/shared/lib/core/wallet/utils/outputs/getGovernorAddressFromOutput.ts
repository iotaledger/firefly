import { OUTPUT_TYPE_ALIAS, UNLOCK_CONDITION_GOVERNOR_ADDRESS } from '@core/wallet/constants'
import { OutputTypes, IGovernorAddressUnlockCondition, IEd25519Address } from '@iota/types'
import { convertEd25519ToBech32 } from '../convertEd25519ToBech32'

export function getGovernorAddressFromOutput(output: OutputTypes): string {
    if (output && output?.type === OUTPUT_TYPE_ALIAS) {
        const governorUnlockCondition = output.unlockConditions.find(
            (unlockCondition) => unlockCondition.type === UNLOCK_CONDITION_GOVERNOR_ADDRESS
        ) as IGovernorAddressUnlockCondition
        return convertEd25519ToBech32((governorUnlockCondition.address as IEd25519Address).pubKeyHash)
    } else {
        return undefined
    }
}
