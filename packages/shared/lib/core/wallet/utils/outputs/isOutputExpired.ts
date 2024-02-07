import { CommonOutput, ExpirationUnlockCondition, UnlockConditionType } from '@iota/sdk/out/types'
import { get } from 'svelte/store'
import { getSlotIndexFromNodeInfo, nodeInfoProtocolParameters } from 'shared/lib/core/network'

export function isOutputExpired(output: CommonOutput): boolean | undefined {
    const expirationUnlockCondition = output.unlockConditions.find(
        (unlockCondition) => unlockCondition.type === UnlockConditionType.Expiration
    ) as ExpirationUnlockCondition
    const nodeProtocolParameters = get(nodeInfoProtocolParameters)
    const outputSlotIndex = expirationUnlockCondition?.slotIndex
    if (!nodeProtocolParameters || !outputSlotIndex) return true

    const actualSlotIndex = getSlotIndexFromNodeInfo(nodeProtocolParameters)
    if (actualSlotIndex > outputSlotIndex + nodeProtocolParameters.maxCommittableAge) {
        return false
    } else if (actualSlotIndex <= outputSlotIndex + nodeProtocolParameters.minCommittableAge) {
        return true
    } else {
        return
    }
}
