import { UNLOCK_CONDITION_EXPIRATION } from '../../constants'
import { MILLISECONDS_PER_SECOND } from '@core/utils'
import { Output } from '@core/wallet/types'

export function getExpirationDateFromOutput(output: Output): Date {
    const expirationTime = getExpirationUnixTimeFromOutput(output)
    return expirationTime ? new Date(expirationTime) : undefined
}

export function getExpirationUnixTimeFromOutput(output: Output): number {
    for (const unlockCondition of output.unlockConditions) {
        if (unlockCondition?.type === UNLOCK_CONDITION_EXPIRATION) {
            return unlockCondition?.unixTime * MILLISECONDS_PER_SECOND
        }
    }
}
