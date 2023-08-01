import { MILLISECONDS_PER_SECOND } from '@core/utils'
import { CommonOutput, TimelockUnlockCondition, UnlockConditionType } from '@iota/wallet/out/types'

export function getTimelockDateFromOutput(output: CommonOutput): Date | undefined {
    for (const unlockCondition of output.getUnlockConditions()) {
        if (unlockCondition?.getType() === UnlockConditionType.Timelock) {
            const timelockUnlockCondition = unlockCondition as TimelockUnlockCondition
            const unixTime = timelockUnlockCondition?.getUnixTime()
            return unixTime ? new Date(unixTime * MILLISECONDS_PER_SECOND) : undefined
        }
    }
}
