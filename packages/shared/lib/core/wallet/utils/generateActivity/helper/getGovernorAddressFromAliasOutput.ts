import { getBech32AddressFromAddressTypes } from '../../getBech32AddressFromAddressTypes'
import { AliasOutput, GovernorAddressUnlockCondition, UnlockConditionType } from '@iota/wallet'

export function getGovernorAddressFromAliasOutput(output: AliasOutput): string {
    const governorUnlockCondition = output
        .getUnlockConditions()
        .find(
            (unlockCondition) => unlockCondition.getType() === UnlockConditionType.GovernorAddress
        ) as GovernorAddressUnlockCondition
    return getBech32AddressFromAddressTypes(governorUnlockCondition.getAddress())
}
