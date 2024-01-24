import { MILLISECONDS_PER_SECOND } from '@core/utils'
import { CommonOutput, TimelockUnlockCondition, UnlockConditionType } from '@iota/sdk/out/types'
import { nodeInfoProtocolParameters } from 'shared/lib/core/network'
import { getTimestampFromNodeInfoAndSlotIndex } from 'shared/lib/core/network/helpers/getSlotInfoFromNodeProtocolParameters'
import { get } from 'svelte/store'

export function getTimelockDateFromOutput(output: CommonOutput): Date | undefined {
    for (const unlockCondition of output.unlockConditions) {
        if (unlockCondition?.type === UnlockConditionType.Timelock) {
            const timelockUnlockCondition = unlockCondition as TimelockUnlockCondition
            const nodeProtocolParameters = get(nodeInfoProtocolParameters)
            if (!nodeProtocolParameters) return
            const unixTime = getTimestampFromNodeInfoAndSlotIndex(
                nodeProtocolParameters,
                timelockUnlockCondition?.slotIndex
            )
            return unixTime ? new Date(unixTime * MILLISECONDS_PER_SECOND) : undefined
        }
    }
}
