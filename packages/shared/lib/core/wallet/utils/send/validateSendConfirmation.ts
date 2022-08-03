import { selectedAccount } from '@core/account'
import { InsufficientFundsForStorageDepositError, InvalidExpirationDateTimeError } from '@contexts/wallet'
import { convertUnixTimestampToDate, isValidExpirationDateTime } from '@core/utils'
import { OutputTypes } from '@iota/types'
import { OutputOptions } from '@iota/wallet'
import { get } from 'svelte/store'
import { getStorageDepositFromOutput } from '../outputs'

export function validateSendConfirmation(outputOptions: OutputOptions, outputTypes: OutputTypes): void {
    const parseNumber = (value: string) => parseInt(value, 10) ?? 0
    const amount = parseNumber(outputTypes?.amount)
    const balance = parseNumber(get(selectedAccount)?.balances?.baseCoin.available)
    const [storageDeposit, giftedStorageDeposit] = getStorageDepositFromOutput(outputTypes)
    const expirationDateTime = convertUnixTimestampToDate(outputOptions?.unlocks?.expirationUnixTime)

    if (balance < amount + storageDeposit || balance < amount + giftedStorageDeposit) {
        throw new InsufficientFundsForStorageDepositError()
    } else if (expirationDateTime && !isValidExpirationDateTime(expirationDateTime)) {
        throw new InvalidExpirationDateTimeError()
    }
}
