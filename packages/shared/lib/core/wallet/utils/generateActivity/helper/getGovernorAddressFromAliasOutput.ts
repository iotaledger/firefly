import { UNLOCK_CONDITION_GOVERNOR_ADDRESS } from '@core/wallet/constants'
import { IGovernorAddressUnlockCondition, IAliasOutput } from '@iota/types'
import { getBech32AddressFromAddressTypes } from '../../getBech32AddressFromAddressTypes'

export function getGovernorAddressFromAliasOutput(output: IAliasOutput): string {
    const governorUnlockCondition = output.unlockConditions.find(
        (unlockCondition) => unlockCondition.type === UNLOCK_CONDITION_GOVERNOR_ADDRESS
    ) as IGovernorAddressUnlockCondition
    return getBech32AddressFromAddressTypes(governorUnlockCondition.address)
}
