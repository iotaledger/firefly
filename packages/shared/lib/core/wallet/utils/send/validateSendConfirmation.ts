import { selectedAccount } from '@core/account'
import { InsufficientFundsForStorageDepositError, InvalidExpirationDateTimeError } from '@core/error'
import { convertUnixTimestampToDate, isValidExpirationDateTime } from '@core/utils'
import { OutputTypes } from '@iota/types'
import { OutputOptions } from '@iota/wallet'
import { get } from 'svelte/store'

export function validateSendConfirmation(outputOptions: OutputOptions, outputTypes: OutputTypes): void {
    const parseNumber = (value: string) => parseInt(value, 10) ?? 0
    const amount = parseNumber(outputTypes?.amount)
    const balance = parseNumber(get(selectedAccount)?.balances?.available)
    // const storageDeposit = calculateStorageDepositFromOutput(outputTypes, amount)
    const storageDeposit = 10000000000
    const expirationDateTime = convertUnixTimestampToDate(outputOptions?.unlocks?.expirationUnixTime)

    if (balance < amount + storageDeposit) {
        throw new InsufficientFundsForStorageDepositError()
    } else if (expirationDateTime && !isValidExpirationDateTime(expirationDateTime)) {
        throw new InvalidExpirationDateTimeError()
    }
}
