import { CommonOutput, TimelockUnlockCondition, UnlockConditionType } from '@iota/sdk/out/types'
import { getUnixTimestampFromNodeInfoAndSlotIndex, nodeInfoProtocolParameters } from '@core/network'
import { get } from 'svelte/store'
import { MILLISECONDS_PER_SECOND } from 'shared/lib/core/utils'

export function getTimelockDateFromOutput(output: CommonOutput): Date | undefined {
    for (const unlockCondition of output.unlockConditions) {
        if (unlockCondition?.type === UnlockConditionType.Timelock) {
            const timelockUnlockCondition = unlockCondition as TimelockUnlockCondition
            const nodeProtocolParameters = get(nodeInfoProtocolParameters)
            if (!nodeProtocolParameters) return
            const unixTimestamp = getUnixTimestampFromNodeInfoAndSlotIndex(
                nodeProtocolParameters,
                timelockUnlockCondition?.slot
            )
            return unixTimestamp ? new Date(unixTimestamp * MILLISECONDS_PER_SECOND) : undefined
        }
    }
}
