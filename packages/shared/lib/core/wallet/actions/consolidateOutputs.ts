import { PreparedTransaction } from '@iota/sdk/out/types'
import { getSelectedWallet, IWalletState } from '@core/wallet'
import { handleError } from '@core/error/handlers'
import { plainToInstance } from 'class-transformer'
import { updateActiveWallet } from '@core/profile'

export async function consolidateOutputs(walletToConsolidate?: IWalletState): Promise<void> {
    const wallet = walletToConsolidate || getSelectedWallet()
    if (!wallet) return Promise.reject('No wallet selected')

    try {
        updateActiveWallet(wallet.id, { hasConsolidatingOutputsTransactionInProgress: true, isTransferring: true })

        const preparedConsolidateOutputsTransaction = await wallet.prepareConsolidateOutputs({
            force: false,
            outputThreshold: 2,
            targetAddress: wallet.depositAddress,
        })
        const preparedTransaction = plainToInstance(PreparedTransaction, preparedConsolidateOutputsTransaction)
        const transaction = await preparedTransaction?.send()

        
    } catch (err) {
        handleError(err)
        updateActiveWallet(wallet.id, {
            hasConsolidatingOutputsTransactionInProgress: false,
            isTransferring: false,
        })
    }
}
