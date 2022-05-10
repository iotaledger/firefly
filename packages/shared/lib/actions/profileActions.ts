import { activeProfile } from '@core/profile'
import { accountRouter } from '@core/router'
import { openPopup } from '@lib/popup'
import { isSoftwareProfile } from '@lib/profile'
import { StardustAccount } from '@lib/typings/account'
import { WalletAccount } from '@lib/typings/walletAccount'
import {
    api,
    asyncSyncAccountOffline,
    createAccount,
    getStardustAccount,
    prepareAccountInfo,
    profileManager,
    setSelectedAccount,
    updateBalanceOverview,
} from '@lib/wallet'
import { get } from 'svelte/store'

export async function getAccounts(): Promise<StardustAccount[]> {
    const accountsResponse = await get(profileManager).getAccounts()
    const accountsPromises = accountsResponse.map((acc) => getStardustAccount(acc.meta.index))
    return Promise.all(accountsPromises)
}

export async function loadAccounts(): Promise<void> {
    try {
        const { accountsLoaded, accounts } = get(activeProfile)
        const accountsResponse = await getAccounts()
        if (accountsResponse) {
            if (accountsResponse.length === 0) {
                accountsLoaded.set(true)
                return
            }

            const meta = {
                balance: 0,
                incoming: 0,
                outgoing: 0,
                depositAddress: '',
            }

            const newAccounts: WalletAccount[] = []
            for (const payloadAccount of accountsResponse) {
                const balance = await payloadAccount.balance()
                // TODO: check if this is neccessary -> mainly for showing a correct graph
                // addMessagesPair(payloadAccount)

                meta.balance += balance.available
                meta.incoming += balance.incoming
                meta.outgoing += balance.outgoing
                meta.depositAddress = payloadAccount.meta.publicAddresses[0].toString()

                const account = prepareAccountInfo(payloadAccount, meta)
                newAccounts.push(account)
            }
            accounts.update((_accounts) => newAccounts.sort((a, b) => a.meta.index - b.meta.index))
            // TODO: fix migrations
            // processMigratedTransactions(
            //     payloadAccount.id,
            //     payloadAccount.messages,
            //     payloadAccount.addresses
            // )
            updateBalanceOverview(meta.balance, meta.incoming, meta.outgoing)
            accountsLoaded.set(true)
        }
    } catch (err) {
        console.error(err)
    }
}

export async function tryCreateAccount(alias: string, color: string, onComplete: (err?) => unknown): Promise<void> {
    const _create = async (): Promise<unknown> => {
        try {
            const account = await createAccount(alias, color)
            await asyncSyncAccountOffline(account)

            setSelectedAccount(account?.id)
            get(accountRouter).reset()

            return onComplete()
        } catch (err) {
            return onComplete(err)
        }
    }

    if (get(isSoftwareProfile)) {
        api.getStrongholdStatus({
            onSuccess(strongholdStatusResponse) {
                if (strongholdStatusResponse.payload.snapshot.status === 'Locked') {
                    openPopup({ type: 'password', props: { onSuccess: _create } })
                } else {
                    void _create()
                }
            },
            onError(error) {
                console.error(error)
            },
        })
    } else {
        await _create()
    }
}
