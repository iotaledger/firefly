import { CommonOutput, ExpirationUnlockCondition, SlotIndex, UnlockConditionType } from '@iota/sdk/out/types'
import { get } from 'svelte/store'
import { getSlotIndexFromNodeInfo, nodeInfoProtocolParameters } from '@core/network'

// TODO: Remove temp interface -> https://github.com/iotaledger/firefly/issues/8305
interface ExpirationUnlockConditionTemp extends ExpirationUnlockCondition {
    slot: SlotIndex
}

export function isOutputExpired(output: CommonOutput): boolean | null {
    const expirationUnlockCondition = output.unlockConditions.find(
        (unlockCondition) => unlockCondition.type === UnlockConditionType.Expiration
    ) as ExpirationUnlockConditionTemp
    const nodeProtocolParameters = get(nodeInfoProtocolParameters)
    const outputSlotIndex = expirationUnlockCondition?.slotIndex ?? expirationUnlockCondition?.slot
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
