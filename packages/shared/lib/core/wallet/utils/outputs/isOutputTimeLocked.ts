import { CommonOutput, OutputData, TimelockUnlockCondition, UnlockConditionType } from '@iota/sdk/out/types'
import { nodeInfoProtocolParameters } from '@core/network'
import { get } from 'svelte/store'

export function isOutputTimeLocked(outputData: OutputData): boolean {
    const output = outputData.output as CommonOutput
    const timelockUnlockCondition = output.unlockConditions.find(
        (unlockCondition) => unlockCondition.type === UnlockConditionType.Timelock
    ) as TimelockUnlockCondition
    const nodeProtocolParameters = get(nodeInfoProtocolParameters)
    if (!nodeProtocolParameters || !timelockUnlockCondition) {
        return true
    } else {
        return timelockUnlockCondition.slotIndex + nodeProtocolParameters.minCommittableAge < 0
    }
}
