import { CommonOutput, ExpirationUnlockCondition, UnlockConditionType } from '@iota/sdk/out/types'
import { get } from 'svelte/store'
import { getTimestampFromNodeInfoAndSlotIndex, nodeInfoProtocolParameters } from 'shared/lib/core/network'

export function getExpirationDateFromOutput(output: CommonOutput): Date | undefined {
    const expirationTime = getExpirationUnixTimeFromOutput(output)
    return expirationTime ? new Date(expirationTime) : undefined
}

export function getExpirationUnixTimeFromOutput(output: CommonOutput): number | undefined {
    for (const unlockCondition of output.unlockConditions) {
        if (unlockCondition?.type === UnlockConditionType.Expiration) {
            const nodeProtocolParameters = get(nodeInfoProtocolParameters)
            if (!nodeProtocolParameters) return
            const timestamp = getTimestampFromNodeInfoAndSlotIndex(
                nodeProtocolParameters,
                (unlockCondition as ExpirationUnlockCondition).slotIndex
            )
            return timestamp
        }
    }
}
