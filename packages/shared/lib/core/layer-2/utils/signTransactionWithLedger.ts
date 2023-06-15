import { Ledger } from '@core/ledger'
import { EvmTransactionData } from '../types'
import { Platform } from '@core/app'
import { MILLISECONDS_PER_SECOND, sleep } from '@core/utils'

export async function signTransactionWithLedger(transaction: EvmTransactionData, bip32Path: string): Promise<string> {
    await Ledger.signEvmTransaction(transaction, bip32Path)

    let isSigning = true
    let signedTransaction: string = ''

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
                return Promise.reject('Rejected')
            }
        }
        await sleep(pollingInterval)
    }
    return Promise.reject('Timeout')
}
