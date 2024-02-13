import { CommonOutput, ExpirationUnlockCondition, UnlockConditionType } from '@iota/sdk/out/types'
import { get } from 'svelte/store'
import { getSlotIndexFromNodeInfo, nodeInfoProtocolParameters } from '@core/network'

export function isOutputExpired(output: CommonOutput): boolean | null {
    const expirationUnlockCondition = output.unlockConditions.find(
        (unlockCondition) => unlockCondition.type === UnlockConditionType.Expiration
    ) as ExpirationUnlockCondition
    const nodeProtocolParameters = get(nodeInfoProtocolParameters)
    const outputSlotIndex = expirationUnlockCondition?.slotIndex
    if (!nodeProtocolParameters || !outputSlotIndex) return null

    const actualSlotIndex = getSlotIndexFromNodeInfo(nodeProtocolParameters)
    if (actualSlotIndex > outputSlotIndex + nodeProtocolParameters.maxCommittableAge) {
        return false
    } else if (actualSlotIndex <= outputSlotIndex + nodeProtocolParameters.minCommittableAge) {
        return true
    } else {
        // The expiration is in the deadzone where it can't be unlocked
        return null
    }
}
