import { Ledger } from '@core/ledger'
import { EvmTransactionData } from '../types'
import { Platform } from '@core/app'
import { MILLISECONDS_PER_SECOND, sleep } from '@core/utils'
import { localize } from '@core/i18n'

export async function signTransactionWithLedger(transaction: EvmTransactionData, bip32Path: string): Promise<string> {
    Ledger.signEvmTransaction(transaction, bip32Path)

    let isSigning = true
    let signedTransaction = ''

    function signingFinished(_signedTransaction: string): void {
        isSigning = false
        signedTransaction = _signedTransaction
    }

    Platform.onEvent('evm-signed-transaction', ({ signedTransaction }) => {
        signingFinished(signedTransaction)
    })

    const pollingInterval = 100
    const timeoutInSeconds = 10
    const loopIterations = (timeoutInSeconds * MILLISECONDS_PER_SECOND) / pollingInterval

    for (let count = 0; count < loopIterations; count++) {
        if (!isSigning) {
            if (signedTransaction) {
                return Promise.resolve(signedTransaction)
            } else {
                return Promise.reject('Signing was rejected by the Ledger device')
            }
        }
        await sleep(pollingInterval)
    }
    return Promise.reject(localize('error.ledger.timeout'))
}
