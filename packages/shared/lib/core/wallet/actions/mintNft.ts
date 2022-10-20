import { get } from 'svelte/store'
import { createAliasIfNecessary, selectedAccount, updateSelectedAccount } from '@core/account'
import { NftOptions, TransactionOptions } from '@iota/wallet'
import { activeProfile, ProfileType } from '@core/profile'
import { handleLedgerError } from '@core/ledger'
import { addActivityToAccountActivitiesInAllAccountActivities, resetMintNftDetails } from '../stores'
import { showAppNotification } from '@lib/notifications'
import { localize } from '@core/i18n'
import { Activity } from '../classes'
import { preprocessTransaction } from '../utils'

export async function mintNft(): Promise<void> {
    try {
        updateSelectedAccount({ isTransferring: true })
        const account = get(selectedAccount)

        await createAliasIfNecessary(account)

        // TODO: fill in options
        const nftOptions: NftOptions = {} // fill out
        const transactionOptions: TransactionOptions = {} // fill out
        const mintNftTransaction = await account.mintNfts([nftOptions], transactionOptions)
        const processedTransaction = preprocessTransaction(mintNftTransaction)
        const activity = new Activity(processedTransaction, account)
        addActivityToAccountActivitiesInAllAccountActivities(account.index, activity)
        showAppNotification({
            type: 'success',
            message: localize('notifications.mintNft.success'),
            alert: true,
        })
        resetMintNftDetails()
        updateSelectedAccount({ isTransferring: false })
        return Promise.resolve()
    } catch (reason) {
        updateSelectedAccount({ isTransferring: false })

        const _activeProfile = get(activeProfile)
        if (_activeProfile.type === ProfileType.Ledger) {
            handleLedgerError(reason.error)
        }

        return Promise.reject(reason)
    }
}
