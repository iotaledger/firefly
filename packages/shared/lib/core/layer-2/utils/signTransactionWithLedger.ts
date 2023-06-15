import { Ledger } from '@core/ledger'
import { EvmTransactionData } from '../types'
import { Platform } from '@core/app'
import { sleep } from '@core/utils'

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

    for (let count = 0; count < 11111; count++) {
        if (!isSigning) {
            if (signedTransaction) {
                return Promise.resolve(signedTransaction)
            } else {
                return Promise.reject('Rejected')
            }
        }
        await sleep(100)
    }
    return Promise.reject('Timeout')
}
