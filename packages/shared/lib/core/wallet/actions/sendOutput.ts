import { updateNftInAllWalletNfts } from '@core/nfts/actions'
import { getSelectedWallet, resetNewTokenTransactionDetails, updateSelectedWallet } from '../stores'
import { getDefaultTransactionOptions, processAndAddToActivities } from '../utils'
import { NftOutput, Output, OutputType } from '@iota/sdk/out/types'

export async function sendOutput(output: Output): Promise<void> {
    try {
        updateSelectedWallet({ isTransferring: true })
        const wallet = getSelectedWallet()
        if (!wallet) return
        const transaction = await wallet.sendOutputs([output], getDefaultTransactionOptions())
        // Reset transaction details state, since the transaction has been sent
        if (output.type === OutputType.Nft) {
            const nftId = (output as NftOutput).nftId
            updateNftInAllWalletNfts(wallet.id, nftId, { isSpendable: false })
        }

        resetNewTokenTransactionDetails()

        await processAndAddToActivities(transaction, wallet)
        updateSelectedWallet({ isTransferring: false })
        return
    } catch (err) {
        updateSelectedWallet({ isTransferring: false })
        throw err
    }
}
