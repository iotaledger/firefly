import { ICommonOutput } from '@iota/types'
import { MILLISECONDS_PER_SECOND } from '@lib/time'
import { UNLOCK_CONDITION_EXPIRATION } from '../../constants'

export function getExpirationDateFromOutput(output: ICommonOutput): Date {
    for (const unlockCondition of output.unlockConditions) {
        if (unlockCondition?.type === UNLOCK_CONDITION_EXPIRATION) {
            return unlockCondition?.unixTime ? new Date(unlockCondition?.unixTime * MILLISECONDS_PER_SECOND) : undefined
        }
    }
}
