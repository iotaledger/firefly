import { get } from 'svelte/store'
import { selectedAccount, updateSelectedAccount } from '@core/account'
import { updateNftInAllAccountNfts } from '@core/nfts/actions'
import { resetNewTokenTransactionDetails } from '../stores'
import { getDefaultTransactionOptions, processAndAddToActivities } from '../utils'
import { NftOutput, Output, OutputType } from '@iota/sdk/out/types'

export async function sendOutput(output: Output): Promise<void> {
    try {
        updateSelectedAccount({ isTransferring: true })
        const account = get(selectedAccount)
        if (!account) return
        const transaction = await account.sendOutputs([output], getDefaultTransactionOptions())
        // Reset transaction details state, since the transaction has been sent
        if (output.type === OutputType.Nft) {
            const nftId = (output as NftOutput).nftId
            updateNftInAllAccountNfts(account.index, nftId, { isSpendable: false })
        }

        resetNewTokenTransactionDetails()

        await processAndAddToActivities(transaction, account)
        updateSelectedAccount({ isTransferring: false })
        return
    } catch (err) {
        updateSelectedAccount({ isTransferring: false })
        throw err
    }
}
