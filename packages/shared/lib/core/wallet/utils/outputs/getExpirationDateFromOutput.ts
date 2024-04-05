import { CommonOutput, ExpirationUnlockCondition, UnlockConditionType } from '@iota/sdk/out/types'
import { get } from 'svelte/store'
import { getUnixTimestampFromNodeInfoAndSlotIndex, nodeInfoProtocolParameters } from '@core/network'
import { MILLISECONDS_PER_SECOND } from 'shared/lib/core/utils'

export function getExpirationDateFromOutput(output: CommonOutput): Date | undefined {
    const expirationUnixTime = getExpirationUnixTimeFromOutput(output)
    return expirationUnixTime ? new Date(expirationUnixTime * MILLISECONDS_PER_SECOND) : undefined
}

export function getExpirationUnixTimeFromOutput(output: CommonOutput): number | undefined {
    for (const unlockCondition of output.unlockConditions) {
        if (unlockCondition?.type === UnlockConditionType.Expiration) {
            const nodeProtocolParameters = get(nodeInfoProtocolParameters)
            if (!nodeProtocolParameters) return
            const unixTimestamp = getUnixTimestampFromNodeInfoAndSlotIndex(
                nodeProtocolParameters,
                (unlockCondition as ExpirationUnlockCondition).slot
            )
            return unixTimestamp
        }
    }
}
