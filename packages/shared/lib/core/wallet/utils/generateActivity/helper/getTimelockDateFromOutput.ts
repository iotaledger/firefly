import { CommonOutput, TimelockUnlockCondition, UnlockConditionType } from '@iota/sdk/out/types'
import { getUnixTimestampFromNodeInfoAndSlotIndex, nodeInfoProtocolParameters } from 'shared/lib/core/network'
import { get } from 'svelte/store'

export function getTimelockDateFromOutput(output: CommonOutput): Date | undefined {
    for (const unlockCondition of output.unlockConditions) {
        if (unlockCondition?.type === UnlockConditionType.Timelock) {
            const timelockUnlockCondition = unlockCondition as TimelockUnlockCondition
            const nodeProtocolParameters = get(nodeInfoProtocolParameters)
            if (!nodeProtocolParameters) return
            const unixTimestamp = getUnixTimestampFromNodeInfoAndSlotIndex(
                nodeProtocolParameters,
                timelockUnlockCondition?.slotIndex
            )
            return unixTimestamp ? new Date(unixTimestamp) : undefined
        }
    }
}
