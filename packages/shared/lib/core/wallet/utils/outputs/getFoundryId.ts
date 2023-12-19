import {
    AccountAddress,
    AddressType,
    FoundryId,
    FoundryOutput,
    ImmutableAccountAddressUnlockCondition,
    UnlockConditionType,
} from '@iota/sdk/out/types'
import { api } from '@core/api'

// TODO(2.0) Alias outputs are gone
export function buildFoundryId(foundry: FoundryOutput): Promise<FoundryId> {
    const unlockCondition = foundry.unlockConditions[0] as ImmutableAccountAddressUnlockCondition
    const isImmutableAccountAddress = unlockCondition.type === UnlockConditionType.ImmutableAccountAddress

    let aliasId = ''

    if (isImmutableAccountAddress) {
        const hasAccountAddress = unlockCondition.address.type === AddressType.Account
        if (hasAccountAddress) {
            aliasId = (unlockCondition.address as AccountAddress).accountId
        }
    }

    return api.computeFoundryId(aliasId, foundry.serialNumber, foundry.tokenScheme.type)
}
