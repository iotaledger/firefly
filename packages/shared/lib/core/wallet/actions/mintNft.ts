import { get } from 'svelte/store'
import { createAliasIfNecessary, selectedAccount, updateSelectedAccount } from '@core/account'
import { NftOptions, TransactionOptions } from '@iota/wallet'
import { activeProfile, ProfileType } from '@core/profile'
import { handleLedgerError } from '@core/ledger'
import { addActivityToAccountActivitiesInAllAccountActivities, resetMintNftDetails } from '../stores'
import { localize } from '@core/i18n'
import { preprocessTransaction } from '../utils'
import { Converter } from '@core/utils'
import { INftMetadata } from '../interfaces'
import { showAppNotification } from '@auxiliary/notification'
import { generateActivity } from '../utils/generateActivity'

export async function mintNft(metadata: INftMetadata): Promise<void> {
    try {
        updateSelectedAccount({ isTransferring: true })
        const account = get(selectedAccount)
        await createAliasIfNecessary(account)

        const nftOptions: NftOptions = {
            immutableMetadata: Converter.utf8ToHex(JSON.stringify(metadata), true),
        }
        const transactionOptions: TransactionOptions = {
            remainderValueStrategy: { strategy: 'ReuseAddress', value: null },
        }

        const mintNftTransaction = await account.mintNfts([nftOptions], transactionOptions)
        const processedTransaction = preprocessTransaction(mintNftTransaction)
        const activity = generateActivity(processedTransaction, account)

        addActivityToAccountActivitiesInAllAccountActivities(account.index, activity)
        showAppNotification({
            type: 'success',
            message: localize('notifications.mintNft.success'),
            alert: true,
        })
        resetMintNftDetails()
        return Promise.resolve()
    } catch (reason) {
        const _activeProfile = get(activeProfile)
        if (_activeProfile.type === ProfileType.Ledger) {
            handleLedgerError(reason.error)
        }

        return Promise.reject(reason)
    } finally {
        updateSelectedAccount({ isTransferring: false })
    }
}
