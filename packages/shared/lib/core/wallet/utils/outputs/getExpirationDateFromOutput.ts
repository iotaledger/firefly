import { OutputTypes } from '@iota/types'
import { MILLISECONDS_PER_SECOND } from '@core/utils'
import { OUTPUT_TYPE_TREASURY, UNLOCK_CONDITION_EXPIRATION } from '../../constants'

export function getExpirationDateFromOutput(output: OutputTypes): Date {
    const expirationTime = getExpirationUnixTimeFromOutput(output)
    return expirationTime ? new Date(expirationTime) : undefined
}

export function getExpirationUnixTimeFromOutput(output: OutputTypes): number {
    if (output && output?.type !== OUTPUT_TYPE_TREASURY) {
        for (const unlockCondition of output.unlockConditions) {
            if (unlockCondition?.type === UNLOCK_CONDITION_EXPIRATION) {
                return unlockCondition?.unixTime * MILLISECONDS_PER_SECOND
            }
        }
    }
}
