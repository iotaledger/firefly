import { ICommonOutput } from '@iota/types'
import { MILLISECONDS_PER_SECOND } from '@lib/time'
import { UNLOCK_CONDITION_TIMELOCK } from '../../../constants'

export function getTimelockDateFromOutput(output: ICommonOutput): Date {
    for (const unlockCondition of output.unlockConditions) {
        if (unlockCondition?.type === UNLOCK_CONDITION_TIMELOCK) {
            return unlockCondition?.unixTime ? new Date(unlockCondition?.unixTime * MILLISECONDS_PER_SECOND) : undefined
        }
    }
}
