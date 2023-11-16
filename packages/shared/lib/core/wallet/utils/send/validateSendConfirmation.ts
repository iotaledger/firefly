import { InvalidExpirationDateTimeError } from '@contexts/wallet'
import { convertUnixTimestampToDate, isValidExpirationDateTime } from '@core/utils'
import { CommonOutput, ExpirationUnlockCondition, UnlockConditionType } from '@iota/sdk/out/types'

export function validateSendConfirmation(output: CommonOutput): void {
    const expirationUnlockCondition = output.unlockConditions.find(
        (c) => c.type === UnlockConditionType.Expiration
    ) as ExpirationUnlockCondition
    const expirationUnixTime = expirationUnlockCondition?.unixTime
    const expirationDateTime = expirationUnixTime ? convertUnixTimestampToDate(expirationUnixTime) : undefined

    if (expirationDateTime && !isValidExpirationDateTime(expirationDateTime)) {
        throw new InvalidExpirationDateTimeError()
    }
}
