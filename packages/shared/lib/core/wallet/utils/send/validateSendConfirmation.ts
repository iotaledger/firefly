import { selectedAccount } from '@core/account'
import { InsufficientFundsForStorageDepositError, InvalidExpirationDateTimeError } from '@contexts/wallet'
import { convertUnixTimestampToDate, isValidExpirationDateTime } from '@core/utils'
import { OutputParams } from '@iota/wallet'
import { get } from 'svelte/store'
import { getStorageDepositFromOutput } from '../generateActivity/helper'
import { Output } from '@core/wallet/types'

export function validateSendConfirmation(outputParams: OutputParams, outputTypes: Output): void {
    const parseNumber: (value: string) => number = (value: string) => parseInt(value, 10) ?? 0
    const amount = parseNumber(outputTypes?.amount)
    const balance = parseNumber(get(selectedAccount)?.balances?.baseCoin.available)
    const { storageDeposit, giftedStorageDeposit } = getStorageDepositFromOutput(outputTypes)
    const expirationDateTime = convertUnixTimestampToDate(outputParams?.unlocks?.expirationUnixTime)

    const isNft = !!outputParams?.assets?.nftId
    if (!isNft && (balance < amount + storageDeposit || balance < amount + giftedStorageDeposit)) {
        throw new InsufficientFundsForStorageDepositError()
    } else if (expirationDateTime && !isValidExpirationDateTime(expirationDateTime)) {
        throw new InvalidExpirationDateTimeError()
    }
}
