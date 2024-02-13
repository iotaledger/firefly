import {
    AccountAddress,
    AddressType,
    FoundryId,
    FoundryOutput,
    ImmutableAccountAddressUnlockCondition,
    UnlockConditionType,
} from '@iota/sdk/out/types'
import { api } from '@core/api'

export function buildFoundryId(foundry: FoundryOutput): Promise<FoundryId> {
    const unlockCondition = foundry.unlockConditions[0] as ImmutableAccountAddressUnlockCondition
    const isImmutableAccountAddress = unlockCondition.type === UnlockConditionType.ImmutableAccountAddress

    let accountId = ''

    if (isImmutableAccountAddress) {
        const hasAccountAddress = unlockCondition.address.type === AddressType.Account
        if (hasAccountAddress) {
            accountId = (unlockCondition.address as AccountAddress).accountId
        }
    }

    return api.computeFoundryId(accountId, foundry.serialNumber, foundry.tokenScheme.type)
}
