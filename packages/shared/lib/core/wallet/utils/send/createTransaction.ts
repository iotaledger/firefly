import { prepareOutput } from '@core/account'
import { ledgerPreparedOutput } from '@core/ledger'
import { checkActiveProfileAuth, getIsActiveLedgerProfile } from '@core/profile'
import { validateSendConfirmation } from '.'
import { sendOutput } from '../../actions'
import { DEFAULT_TRANSACTION_OPTIONS } from '../../constants'
import { NewTokenTransactionDetails } from '../../types'
import { getOutputParameters } from '../getOutputParameters'

export async function createTransaction(
    transactionDetails: NewTokenTransactionDetails,
    accountIndex: number,
    callback: () => void
): Promise<void> {
    const asset = transactionDetails.asset
    if (!asset) {
        return
    }

    await sendFromLayer1(transactionDetails, accountIndex, callback)
}

async function sendFromLayer1(
    transactionDetails: NewTokenTransactionDetails,
    accountIndex: number,
    callback: () => void
): Promise<void> {
    const outputParams = getOutputParameters(transactionDetails)
    const preparedOutput = await prepareOutput(accountIndex, outputParams, DEFAULT_TRANSACTION_OPTIONS)

    validateSendConfirmation(preparedOutput)

    if (getIsActiveLedgerProfile()) {
        ledgerPreparedOutput.set(preparedOutput)
    }

    await checkActiveProfileAuth(
        async () => {
            await sendOutput(preparedOutput)
            callback()
        },
        { stronghold: true, ledger: false }
    )
}
