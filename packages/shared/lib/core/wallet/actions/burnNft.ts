import { PreparedTransaction } from '@iota/sdk/out/types'
import { plainToInstance } from 'class-transformer'

import { showAppNotification } from '@auxiliary/notification'
import { selectedAccount, updateSelectedAccount } from '@core/account/stores/selected-account.store'
import { localize } from '@core/i18n'
import { updateNftInAllAccountNfts } from '@core/nfts'
import { handleError } from '@core/error/handlers'
import { get } from 'svelte/store'
import { processAndAddToActivities } from '../utils'

export async function burnNft(nftId: string): Promise<void> {
    const account = get(selectedAccount)
    try {
        updateSelectedAccount({ isTransferring: true })
        const prepareBurnNftTransaction = await account?.prepareBurnNft(nftId)
        const preparedTransaction = plainToInstance(PreparedTransaction, prepareBurnNftTransaction)
        const burnNftTransaction = await preparedTransaction?.send()

        // Generate Activity
        await processAndAddToActivities(burnNftTransaction, account)

        // Update NFT
        updateNftInAllAccountNfts(account.index, nftId, { isSpendable: false })

        showAppNotification({
            type: 'success',
            message: localize('notifications.burnNft.success'),
            alert: true,
        })
    } catch (err) {
        handleError(err)
        throw err
    } finally {
        updateSelectedAccount({ isTransferring: false })
    }
}
