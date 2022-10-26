import { OutputTypes } from '@iota/types'
import { MILLISECONDS_PER_SECOND } from '@core/utils'
import { OUTPUT_TYPE_TREASURY, UNLOCK_CONDITION_EXPIRATION } from '../../constants'

export function getExpirationDateFromOutput(output: OutputTypes): Date {
    if (output && output?.type !== OUTPUT_TYPE_TREASURY) {
        for (const unlockCondition of output.unlockConditions) {
            if (unlockCondition?.type === UNLOCK_CONDITION_EXPIRATION) {
                return unlockCondition?.unixTime
                    ? new Date(unlockCondition?.unixTime * MILLISECONDS_PER_SECOND)
                    : undefined
            }
        }
    } else {
        return undefined
    }
}
