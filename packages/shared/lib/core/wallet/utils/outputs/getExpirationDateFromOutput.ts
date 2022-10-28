import { ICommonOutput } from '@iota/types'
import { UNLOCK_CONDITION_EXPIRATION } from '../../constants'
import { MILLISECONDS_PER_SECOND } from '@core/utils'

export function getExpirationDateFromOutput(output: ICommonOutput): Date {
    for (const unlockCondition of output.unlockConditions) {
        if (unlockCondition?.type === UNLOCK_CONDITION_EXPIRATION) {
            return unlockCondition?.unixTime ? new Date(unlockCondition?.unixTime * MILLISECONDS_PER_SECOND) : undefined
        }
    }
}
