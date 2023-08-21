import { api } from '@core/profile-manager'
import {
    AddressType,
    AliasAddress,
    FoundryId,
    FoundryOutput,
    ImmutableAliasAddressUnlockCondition,
    UnlockConditionType,
} from '@iota/sdk/out/types'

export function buildFoundryId(foundry: FoundryOutput): Promise<FoundryId> {
    const unlockCondition = foundry.unlockConditions[0] as ImmutableAliasAddressUnlockCondition
    const isImmutableAliasAddress = unlockCondition.type === UnlockConditionType.ImmutableAliasAddress

    let aliasId = ''

    if (isImmutableAliasAddress) {
        const hasAliasAddress = unlockCondition.address.type === AddressType.Alias
        if (hasAliasAddress) {
            aliasId = (unlockCondition.address as AliasAddress).aliasId
        }
    }

    return api.computeFoundryId(aliasId, foundry.serialNumber, foundry.tokenScheme.type)
}
