import { getSelectedAccount } from '@core/account'
import { InsufficientFundsForStorageDepositError, InvalidExpirationDateTimeError } from '@contexts/wallet'
import { convertUnixTimestampToDate, isValidExpirationDateTime } from '@core/utils'
import { getStorageDepositFromOutput } from '../generateActivity/helper'
import { Output } from '@core/wallet/types'
import { OUTPUT_TYPE_NFT, UNLOCK_CONDITION_EXPIRATION } from '@core/wallet/constants'
import { IExpirationUnlockCondition } from '@iota/types'

export function validateSendConfirmation(output: Output): void {
    const parseNumber: (value: string) => number = (value: string) => parseInt(value, 10) ?? 0
    const amount = parseNumber(output?.amount)
    const balance = parseNumber(getSelectedAccount()?.balances?.baseCoin.available ?? '0')
    const { storageDeposit, giftedStorageDeposit } = getStorageDepositFromOutput(output)

    const expirationUnlockCondition = output.unlockConditions.find(
        (c) => c.type === UNLOCK_CONDITION_EXPIRATION
    ) as IExpirationUnlockCondition
    const expirationUnixTime = expirationUnlockCondition?.unixTime
    const expirationDateTime = expirationUnixTime ? convertUnixTimestampToDate(expirationUnixTime) : undefined

    const isNft = output.type === OUTPUT_TYPE_NFT
    if (!isNft && (balance < amount + storageDeposit || balance < amount + giftedStorageDeposit)) {
        throw new InsufficientFundsForStorageDepositError()
    } else if (expirationDateTime && !isValidExpirationDateTime(expirationDateTime)) {
        throw new InvalidExpirationDateTimeError()
    }
}
