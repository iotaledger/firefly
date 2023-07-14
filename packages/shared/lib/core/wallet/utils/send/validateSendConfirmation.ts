import { getSelectedAccount } from '@core/account'
import { InsufficientFundsForStorageDepositError, InvalidExpirationDateTimeError } from '@contexts/wallet'
import { convertUnixTimestampToDate, isValidExpirationDateTime } from '@core/utils'
import { getStorageDepositFromOutput } from '../generateActivity/helper'
import { IAccountState } from '@core/account/interfaces'
import { CommonOutput, ExpirationUnlockCondition, OutputType, UnlockConditionType } from '@iota/wallet'

export async function validateSendConfirmation(account: IAccountState, output: CommonOutput): Promise<void> {
    const parseNumber: (value: string) => number = (value: string) => parseInt(value, 10) ?? 0
    const amount = parseNumber(output?.getAmount())
    const balance = parseNumber(getSelectedAccount()?.balances?.baseCoin.available ?? '0')
    const { storageDeposit, giftedStorageDeposit } = await getStorageDepositFromOutput(account, output)

    const expirationUnlockCondition = output
        .getUnlockConditions()
        .find((c) => c.getType() === UnlockConditionType.Expiration) as ExpirationUnlockCondition
    const expirationUnixTime = expirationUnlockCondition?.getUnixTime()
    const expirationDateTime = expirationUnixTime ? convertUnixTimestampToDate(expirationUnixTime) : undefined

    const isNft = output.getType() === OutputType.Nft
    if (!isNft && (balance < amount + storageDeposit || balance < amount + giftedStorageDeposit)) {
        throw new InsufficientFundsForStorageDepositError()
    } else if (expirationDateTime && !isValidExpirationDateTime(expirationDateTime)) {
        throw new InvalidExpirationDateTimeError()
    }
}
