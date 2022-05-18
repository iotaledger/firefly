<script lang="typescript">
    import { IAccountState, selectedAccount, setSelectedAccount } from '@core/account'
    import { localize } from '@core/i18n'
    import { resetAccountRouter } from '@core/router'
    import { showAppNotification } from '@lib/notifications'
    import { participationAction } from '@lib/participation/stores'
    import { openPopup } from '@lib/popup'
    import { isSyncing, isTransferring } from '@lib/wallet'
    import { HR, Icon, Modal, Text } from 'shared/components'
    import { AccountLabel } from 'shared/components/atoms/'

    export let accounts: IAccountState[] = []
    export let modal: Modal

    function handleAccountClick(accountId: string): void {
        if ($isSyncing) {
            showWarning(localize('notifications.syncing'))
        } else if ($isTransferring) {
            showWarning(localize('notifications.transferring'))
        } else if ($participationAction) {
            showWarning(localize('notifications.participating'))
        } else {
            setSelectedAccount(accountId)
            resetAccountRouter(false)
            modal?.close()
        }
    }

    function showWarning(message: string) {
        showAppNotification({
            type: 'warning',
            message,
        })
    }

    function handleCreateAccountClick(): void {
        modal?.close()
        openPopup({ type: 'createAccount' })
    }
</script>

<Modal bind:this={modal} classes="transform -translate-x-1/2" size="large" position={{ top: '30px', left: '50%' }}>
    <div class="p-4">
        <div class="accounts flex flex-col space-y-1 scrollable-y">
            {#each accounts as account}
                <button
                    on:click={() => handleAccountClick(account.id)}
                    class="hover:bg-gray-50 dark:hover:bg-gray-800 flex flex-row justify-between p-4 rounded"
                >
                    <div class="flex flex-row items-center space-x-4">
                        <AccountLabel selected={account.id === $selectedAccount?.id} {account} />
                    </div>
                    <Text classes={account.id !== $selectedAccount?.id ? 'opacity-50' : ''} type="h5">
                        {account.balances.total}
                    </Text>
                </button>
            {/each}
        </div>
    </div>
    <HR />
    <button
        class="w-full hover:bg-gray-50 dark:hover:bg-gray-800 flex flex-row justify-between p-8"
        on:click={handleCreateAccountClick}
    >
        <div class="flex flex-row items-center space-x-4">
            <Icon icon="plus" height="12" width="12" classes="text-blue-500" />
            <Text highlighted type="h5" classes="text-14">{localize('general.addAWallet')}</Text>
        </div>
        <Text classes="opacity-50" type="h5">
            {localize('general.total', { values: { balance: '000.000' } })}
        </Text>
    </button>
</Modal>
