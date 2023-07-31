import { CommonOutput, ExpirationUnlockCondition, UnlockConditionType } from '@iota/wallet'
import { MILLISECONDS_PER_SECOND } from '@core/utils'

export function getExpirationDateFromOutput(output: CommonOutput): Date | undefined {
    const expirationTime = getExpirationUnixTimeFromOutput(output)
    return expirationTime ? new Date(expirationTime) : undefined
}

export function getExpirationUnixTimeFromOutput(output: CommonOutput): number | undefined {
    for (const unlockCondition of output.unlockConditions) {
        if (unlockCondition?.type === UnlockConditionType.Expiration) {
            return (unlockCondition as ExpirationUnlockCondition).unixTime * MILLISECONDS_PER_SECOND
        }
    }
}
