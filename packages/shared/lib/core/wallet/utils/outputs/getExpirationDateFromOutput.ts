import { CommonOutput, ExpirationUnlockCondition, UnlockConditionType } from '@iota/sdk/out/types'
import { MILLISECONDS_PER_SECOND } from '@core/utils'
import { get } from 'svelte/store'
import { nodeInfoProtocolParameters } from 'shared/lib/core/network'
import { getTimestampFromNodeInfoAndSlotIndex } from 'shared/lib/core/network/helpers/getSlotInfoFromNodeProtocolParameters'

export function getExpirationDateFromOutput(output: CommonOutput): Date | undefined {
    const expirationTime = getExpirationUnixTimeFromOutput(output)
    return expirationTime ? new Date(expirationTime) : undefined
}

export function getExpirationUnixTimeFromOutput(output: CommonOutput): number | undefined {
    for (const unlockCondition of output.unlockConditions) {
        if (unlockCondition?.type === UnlockConditionType.Expiration) {
            const nodeProtocolParameters = get(nodeInfoProtocolParameters)
            if (!nodeProtocolParameters) return
            const unixTime = getTimestampFromNodeInfoAndSlotIndex(
                nodeProtocolParameters,
                (unlockCondition as ExpirationUnlockCondition).slotIndex
            )
            return unixTime * MILLISECONDS_PER_SECOND
        }
    }
}
