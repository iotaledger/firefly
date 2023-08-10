import { getSelectedAccount } from '@core/account'
import { InsufficientFundsForStorageDepositError, InvalidExpirationDateTimeError } from '@contexts/wallet'
import { convertUnixTimestampToDate, isValidExpirationDateTime } from '@core/utils'
import { getStorageDepositFromOutput } from '../generateActivity/helper'
import { IAccountState } from '@core/account/interfaces'
import { CommonOutput, ExpirationUnlockCondition, OutputType, UnlockConditionType } from '@iota/wallet/out/types'

export async function validateSendConfirmation(account: IAccountState, output: CommonOutput): Promise<void> {
    const parseNumber = (value: string) => parseInt(value, 10) ?? 0
    const amount = parseNumber(output?.amount)
    const balance = parseNumber(getSelectedAccount()?.balances?.baseCoin.available.toString() ?? '0')
    const { storageDeposit, giftedStorageDeposit } = await getStorageDepositFromOutput(account, output)

    const expirationUnlockCondition = output.unlockConditions.find(
        (c) => c.type === UnlockConditionType.Expiration
    ) as ExpirationUnlockCondition
    const expirationUnixTime = expirationUnlockCondition?.unixTime
    const expirationDateTime = expirationUnixTime ? convertUnixTimestampToDate(expirationUnixTime) : undefined

    const isNft = output.type === OutputType.Nft
    if (!isNft && (balance < amount + storageDeposit || balance < amount + giftedStorageDeposit)) {
        throw new InsufficientFundsForStorageDepositError()
    } else if (expirationDateTime && !isValidExpirationDateTime(expirationDateTime)) {
        throw new InvalidExpirationDateTimeError()
    }
}
