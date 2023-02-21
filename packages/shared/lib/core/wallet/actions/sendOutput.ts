import { get } from 'svelte/store'
import { selectedAccount, updateSelectedAccount } from '@core/account'
import { removeNftFromSelectedAccount } from '@core/nfts/actions'

import { DEFAULT_TRANSACTION_OPTIONS, OUTPUT_TYPE_NFT } from '../constants'
import { resetNewTokenTransactionDetails } from '../stores'
import { Output } from '../types'
import { processAndAddToActivities } from '../utils'

export async function sendOutput(output: Output): Promise<void> {
    try {
        updateSelectedAccount({ isTransferring: true })
        const account = get(selectedAccount)
        const transaction = await account.sendOutputs([output], DEFAULT_TRANSACTION_OPTIONS)
        // Reset transaction details state, since the transaction has been sent
        if (output.type === OUTPUT_TYPE_NFT) {
            removeNftFromSelectedAccount(account.index, output.nftId)
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
