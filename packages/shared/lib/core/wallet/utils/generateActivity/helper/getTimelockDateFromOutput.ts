import { MILLISECONDS_PER_SECOND } from '@core/utils'
import { CommonOutput, TimelockUnlockCondition, UnlockConditionType } from '@iota/sdk/out/types'

export function getTimelockDateFromOutput(output: CommonOutput): Date | undefined {
    for (const unlockCondition of output.unlockConditions) {
        if (unlockCondition?.type === UnlockConditionType.Timelock) {
            const timelockUnlockCondition = unlockCondition as TimelockUnlockCondition
            const unixTime = timelockUnlockCondition?.unixTime // TODO(2.0) Unix time is gone, we now have slots
            return unixTime ? new Date(unixTime * MILLISECONDS_PER_SECOND) : undefined
        }
    }
}
