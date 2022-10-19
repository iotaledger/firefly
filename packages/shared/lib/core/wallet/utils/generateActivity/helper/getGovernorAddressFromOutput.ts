import { OUTPUT_TYPE_ALIAS, UNLOCK_CONDITION_GOVERNOR_ADDRESS } from '@core/wallet/constants'
import { OutputTypes, IGovernorAddressUnlockCondition } from '@iota/types'
import { getBech32AddressFromAddressTypes } from '../../getBech32AddressFromAddressTypes'

export function getGovernorAddressFromOutput(output: OutputTypes): string {
    if (output && output.type === OUTPUT_TYPE_ALIAS) {
        const governorUnlockCondition = output.unlockConditions.find(
            (unlockCondition) => unlockCondition.type === UNLOCK_CONDITION_GOVERNOR_ADDRESS
        ) as IGovernorAddressUnlockCondition
        return getBech32AddressFromAddressTypes(governorUnlockCondition.address)
    } else {
        return undefined
    }
}
