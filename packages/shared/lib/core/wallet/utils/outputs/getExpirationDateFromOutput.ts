import { ICommonOutput } from '@iota/types'
import { UNLOCK_CONDITION_EXPIRATION } from '../../constants'
import { MILLISECONDS_PER_SECOND } from '@core/utils'

export function getExpirationDateFromOutput(output: ICommonOutput): Date {
    const expirationTime = getExpirationUnixTimeFromOutput(output)
    return expirationTime ? new Date(expirationTime) : undefined
}

export function getExpirationUnixTimeFromOutput(output: ICommonOutput): number {
    for (const unlockCondition of output.unlockConditions) {
        if (unlockCondition?.type === UNLOCK_CONDITION_EXPIRATION) {
            return unlockCondition?.unixTime * MILLISECONDS_PER_SECOND
        }
    }
}
