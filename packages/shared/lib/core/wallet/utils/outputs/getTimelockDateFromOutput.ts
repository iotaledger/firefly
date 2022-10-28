import { OutputTypes } from '@iota/types'
import { MILLISECONDS_PER_SECOND } from '@core/utils'
import { OUTPUT_TYPE_TREASURY, UNLOCK_CONDITION_TIMELOCK } from '../../constants'

export function getTimelockDateFromOutput(output: OutputTypes): Date {
    if (output && output?.type !== OUTPUT_TYPE_TREASURY) {
        for (const unlockCondition of output.unlockConditions) {
            if (unlockCondition?.type === UNLOCK_CONDITION_TIMELOCK) {
                return unlockCondition?.unixTime
                    ? new Date(unlockCondition?.unixTime * MILLISECONDS_PER_SECOND)
                    : undefined
            }
        }
    } else {
        return undefined
    }
}
