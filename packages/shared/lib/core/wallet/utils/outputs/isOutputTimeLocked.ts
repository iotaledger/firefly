import { CommonOutput, OutputData, TimelockUnlockCondition, UnlockConditionType } from '@iota/sdk/out/types'
import { getSlotIndexFromNodeInfo, nodeInfoProtocolParameters } from '@core/network'
import { get } from 'svelte/store'

export function isOutputTimeLocked(outputData: OutputData): boolean {
    const output = outputData.output as CommonOutput
    const timelockUnlockCondition = output.unlockConditions.find(
        (unlockCondition) => unlockCondition.type === UnlockConditionType.Timelock
    ) as TimelockUnlockCondition
    const nodeProtocolParameters = get(nodeInfoProtocolParameters)
    if (!nodeProtocolParameters || !timelockUnlockCondition) {
        return false
    } else {
        const currentSlotIndex = getSlotIndexFromNodeInfo(nodeProtocolParameters)
        return currentSlotIndex + nodeProtocolParameters.minCommittableAge < timelockUnlockCondition.slotIndex
    }
}
