import { MILLISECONDS_PER_SECOND } from '@core/utils'
import { Output } from '@core/wallet/types'
import { TimelockUnlockCondition, UnlockConditionType } from '@iota/wallet'

export function getTimelockDateFromOutput(output: Output): Date | undefined {
    for (const unlockCondition of output.getUnlockConditions()) {
        if (unlockCondition?.getType() === UnlockConditionType.Timelock) {
            const timelockUnlockCondition = unlockCondition as TimelockUnlockCondition
            const unixTime = timelockUnlockCondition?.getUnixTime()
            return unixTime ? new Date(unixTime * MILLISECONDS_PER_SECOND) : undefined
        }
    }
}
