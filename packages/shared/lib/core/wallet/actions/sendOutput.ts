import { selectedAccount } from '@core/account'
import { InsufficientFundsForStorageDepositError, InvalidExpirationDateTimeError } from '@core/error'
import { convertUnixTimestampToDate, isValidExpirationDateTime } from '@core/utils'
import { OutputTypes } from '@iota/types'
import { OutputOptions, TransactionOptions } from '@iota/wallet'
import { isTransferring } from '@lib/wallet'
import { get } from 'svelte/store'
import { Activity } from '../classes'
import { addActivityToAccountActivitiesInAllAccountActivities } from '../stores'

export async function sendOutput(outputOptions: OutputOptions, output: OutputTypes): Promise<void> {
    try {
        isTransferring.set(true)
        validate(outputOptions, output)
        const account = get(selectedAccount)
        const transferOptions: TransactionOptions = {
            remainderValueStrategy: { strategy: 'ReuseAddress', value: null },
            skipSync: false,
        }
        const { transactionId } = await account.sendOutputs([output], transferOptions)
        addActivityToAccountActivitiesInAllAccountActivities(
            account.id,
            new Activity().setNewTransaction(account, transactionId, outputOptions, output)
        )
        // TODO: fetch transaction
        isTransferring.set(false)
        return
    } catch (err) {
        isTransferring.set(false)
        throw err
    }
}

function validate(outputOptions: OutputOptions, outputTypes: OutputTypes): void {
    const parseNumber = (value: string) => parseInt(value, 10) ?? 0
    const amount = parseNumber(outputTypes?.amount)
    const balance = parseNumber(get(selectedAccount)?.balances?.available)
    // const storageDeposit = calculateStorageDepositFromOutput(outputTypes, amount)
    const storageDeposit = 10000000000
    const expirationDateTime = convertUnixTimestampToDate(outputOptions?.unlocks?.expirationUnixTime)

    if (balance < amount + storageDeposit) {
        throw new InsufficientFundsForStorageDepositError(storageDeposit + amount - balance, '')
    } else if (expirationDateTime && !isValidExpirationDateTime(expirationDateTime)) {
        throw new InvalidExpirationDateTimeError()
    }
}
