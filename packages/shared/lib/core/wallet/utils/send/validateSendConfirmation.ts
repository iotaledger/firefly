import { selectedAccount } from '@core/account'
import { InsufficientFundsForStorageDepositError, InvalidExpirationDateTimeError } from '@contexts/wallet'
import { convertUnixTimestampToDate, isValidExpirationDateTime } from '@core/utils'
import { IBasicOutput, IAliasOutput, IFoundryOutput, INftOutput } from '@iota/types'
import { OutputOptions } from '@iota/wallet'
import { get } from 'svelte/store'
import { getStorageDepositFromOutput } from '../generateActivity/helper'

export function validateSendConfirmation(
    outputOptions: OutputOptions,
    outputTypes: IBasicOutput | IAliasOutput | IFoundryOutput | INftOutput
): void {
    const parseNumber: (value: string) => number = (value: string) => parseInt(value, 10) ?? 0
    const amount = parseNumber(outputTypes?.amount)
    const balance = parseNumber(get(selectedAccount)?.balances?.baseCoin.available)
    const { storageDeposit, giftedStorageDeposit } = getStorageDepositFromOutput(outputTypes)
    const expirationDateTime = convertUnixTimestampToDate(outputOptions?.unlocks?.expirationUnixTime)

    if (balance < amount + storageDeposit || balance < amount + giftedStorageDeposit) {
        throw new InsufficientFundsForStorageDepositError()
    } else if (expirationDateTime && !isValidExpirationDateTime(expirationDateTime)) {
        throw new InvalidExpirationDateTimeError()
    }
}
