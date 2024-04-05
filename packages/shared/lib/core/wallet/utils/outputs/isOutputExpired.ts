import { CommonOutput, ExpirationUnlockCondition, UnlockConditionType } from '@iota/sdk/out/types'
import { get } from 'svelte/store'
import { getSlotIndexFromNodeInfo, nodeInfoProtocolParameters } from '@core/network'

export function isOutputExpired(output: CommonOutput): boolean | null {
    const expirationUnlockCondition = output.unlockConditions.find(
        (unlockCondition) => unlockCondition.type === UnlockConditionType.Expiration
    ) as ExpirationUnlockCondition
    const nodeProtocolParameters = get(nodeInfoProtocolParameters)
    const outputSlotIndex = expirationUnlockCondition?.slot
    if (!nodeProtocolParameters || !outputSlotIndex) return null

    const currentSlotIndex = getSlotIndexFromNodeInfo(nodeProtocolParameters)
    if (outputSlotIndex > currentSlotIndex + nodeProtocolParameters.maxCommittableAge) {
        return false
    } else if (outputSlotIndex <= currentSlotIndex + nodeProtocolParameters.minCommittableAge) {
        return true
    } else {
        // The expiration is in the deadzone where it can't be unlocked
        return null
    }
}
