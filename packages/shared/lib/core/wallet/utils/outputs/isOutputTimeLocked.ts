import { CommonOutput, OutputData, SlotIndex, TimelockUnlockCondition, UnlockConditionType } from '@iota/sdk/out/types'
import { getSlotIndexFromNodeInfo, nodeInfoProtocolParameters } from '@core/network'
import { get } from 'svelte/store'

// TODO: Remove temp interface -> https://github.com/iotaledger/firefly/issues/8305
interface TimelockUnlockConditionTemp extends TimelockUnlockCondition {
    slot: SlotIndex
}

export function isOutputTimeLocked(outputData: OutputData): boolean {
    const output = outputData.output as CommonOutput
    const timelockUnlockCondition = output.unlockConditions.find(
        (unlockCondition) => unlockCondition.type === UnlockConditionType.Timelock
    ) as TimelockUnlockConditionTemp
    const nodeProtocolParameters = get(nodeInfoProtocolParameters)
    if (!nodeProtocolParameters || !timelockUnlockCondition) {
        return false
    } else {
        const currentSlotIndex = getSlotIndexFromNodeInfo(nodeProtocolParameters)
        return (
            currentSlotIndex + nodeProtocolParameters.minCommittableAge <
            (timelockUnlockCondition.slotIndex ?? timelockUnlockCondition.slot)
        )
    }
}
