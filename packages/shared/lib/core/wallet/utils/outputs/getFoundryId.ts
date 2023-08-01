import {
    AddressType,
    AliasAddress,
    FoundryOutput,
    ImmutableAliasAddressUnlockCondition,
    UnlockConditionType,
    Utils,
} from '@iota/wallet/out/types'

export function buildFoundryId(foundry: FoundryOutput): string {
    const unlockCondition = foundry.getUnlockConditions()[0]
    // TODO-sdk Make this clearer without inline casts
    const aliasId =
        unlockCondition.getType() === UnlockConditionType.ImmutableAliasAddress &&
        (unlockCondition as ImmutableAliasAddressUnlockCondition).getAddress().getType() === AddressType.Alias
            ? ((unlockCondition as ImmutableAliasAddressUnlockCondition).getAddress() as AliasAddress).getAliasId()
            : ''

    return Utils.computeFoundryId(aliasId, foundry.getSerialNumber(), foundry.getTokenScheme().getType())
}
