<script lang="typescript">
    import { Text } from 'shared/components'
    import { AccountLabel } from 'shared/components/atoms'
    import { IAccountState, selectedAccount, setSelectedAccount } from '@core/account'
    import { localize } from '@core/i18n'
    import { BASE_TOKEN } from '@core/network'
    import { activeProfile } from '@core/profile'
    import { formatTokenAmountBestMatch } from '@core/wallet'
    import { showAppNotification } from '@lib/notifications'

    export let account: IAccountState
    export let onClick: () => unknown

    function handleAccountClick(accountId: string): void {
        if (account.isSyncing) {
            showWarning(localize('notifications.syncing'))
        } else {
            setSelectedAccount(accountId)
            onClick && onClick()
        }
    }

    function showWarning(message: string) {
        showAppNotification({
            type: 'warning',
            message,
        })
    }
</script>

<button
    on:click={() => handleAccountClick(account.id)}
    class="hover:bg-gray-50 dark:hover:bg-gray-800 flex flex-row justify-between p-4 rounded"
>
    <div class="flex flex-row items-center space-x-4">
        <AccountLabel selected={account.id === $selectedAccount?.id} {account} />
    </div>
    <Text classes={account.id !== $selectedAccount?.id ? 'opacity-50' : ''} type="h5">
        {formatTokenAmountBestMatch(
            Number(account.balances.baseCoin.total),
            BASE_TOKEN[$activeProfile.networkProtocol]
        )}
    </Text>
</button>
