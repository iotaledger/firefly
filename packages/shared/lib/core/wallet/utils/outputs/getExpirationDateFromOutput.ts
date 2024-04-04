import { CommonOutput, ExpirationUnlockCondition, SlotIndex, UnlockConditionType } from '@iota/sdk/out/types'
import { get } from 'svelte/store'
import { getUnixTimestampFromNodeInfoAndSlotIndex, nodeInfoProtocolParameters } from '@core/network'
import { MILLISECONDS_PER_SECOND } from 'shared/lib/core/utils'

// TODO: Remove temp interface -> https://github.com/iotaledger/firefly/issues/8305
interface ExpirationUnlockConditionTemp extends ExpirationUnlockCondition {
    slot: SlotIndex
}

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
                (unlockCondition as ExpirationUnlockConditionTemp).slotIndex ??
                    (unlockCondition as ExpirationUnlockConditionTemp).slot
            )
            return unixTimestamp
        }
    }
}
