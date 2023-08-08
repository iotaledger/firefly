import { api } from '@core/profile-manager'
import {
    AddressType,
    AliasAddress,
    FoundryId,
    FoundryOutput,
    ImmutableAliasAddressUnlockCondition,
    UnlockConditionType,
} from '@iota/wallet/out/types'

export function buildFoundryId(foundry: FoundryOutput): Promise<FoundryId> {
    const unlockCondition = foundry.unlockConditions[0]
    const aliasId =
        unlockCondition.type === UnlockConditionType.ImmutableAliasAddress &&
        (unlockCondition as ImmutableAliasAddressUnlockCondition).address.type === AddressType.Alias
            ? ((unlockCondition as ImmutableAliasAddressUnlockCondition).address as AliasAddress).aliasId
            : ''

    return api.computeFoundryId(aliasId, foundry.serialNumber, foundry.tokenScheme.type)
}
