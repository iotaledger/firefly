import { getBech32AddressFromAddressTypes } from '../../getBech32AddressFromAddressTypes'
import { AliasOutput, GovernorAddressUnlockCondition, UnlockConditionType } from '@iota/wallet/out/types'

export function getGovernorAddressFromAliasOutput(output: AliasOutput): string {
    const governorUnlockCondition = output.unlockConditions.find(
        (unlockCondition) => unlockCondition.type === UnlockConditionType.GovernorAddress
    ) as GovernorAddressUnlockCondition
    return getBech32AddressFromAddressTypes(governorUnlockCondition.address)
}
