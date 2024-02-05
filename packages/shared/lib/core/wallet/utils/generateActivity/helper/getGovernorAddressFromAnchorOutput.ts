import { getBech32AddressFromAddressTypes } from '../../getBech32AddressFromAddressTypes'
import { AnchorOutput, GovernorAddressUnlockCondition, UnlockConditionType } from '@iota/sdk/out/types'

export function getGovernorAddressFromAnchorOutput(output: AnchorOutput): string {
    const governorUnlockCondition = output.unlockConditions.find(
        (unlockCondition) => unlockCondition.type === UnlockConditionType.GovernorAddress
    ) as GovernorAddressUnlockCondition
    return getBech32AddressFromAddressTypes(governorUnlockCondition.address)
}
