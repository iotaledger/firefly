import { CommonOutput, TimelockUnlockCondition, UnlockConditionType } from '@iota/sdk/out/types'
import { getTimestampFromNodeInfoAndSlotIndex, nodeInfoProtocolParameters } from 'shared/lib/core/network'
import { get } from 'svelte/store'

export function getTimelockDateFromOutput(output: CommonOutput): Date | undefined {
    for (const unlockCondition of output.unlockConditions) {
        if (unlockCondition?.type === UnlockConditionType.Timelock) {
            const timelockUnlockCondition = unlockCondition as TimelockUnlockCondition
            const nodeProtocolParameters = get(nodeInfoProtocolParameters)
            if (!nodeProtocolParameters) return
            const timestamp = getTimestampFromNodeInfoAndSlotIndex(
                nodeProtocolParameters,
                timelockUnlockCondition?.slotIndex
            )
            return timestamp ? new Date(timestamp) : undefined
        }
    }
}
