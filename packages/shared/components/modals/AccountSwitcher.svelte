<script lang="typescript">
    import { HR, Icon, Modal, Text } from 'shared/components'
    import { localize } from '@core/i18n'
    import { resetAccountRouter } from '@core/router'
    import { openPopup } from '@lib/popup'
    import { activeProfile, getColor } from '@lib/profile'
    import { WalletAccount } from '@lib/typings/wallet'
    import { showAppNotification } from '@lib/notifications'
    import { selectedAccount, setSelectedAccount, isSyncing, isTransferring } from '@lib/wallet'
    import { participationAction } from '@lib/participation/stores'

    export let accounts: WalletAccount[] = []
    export let onCreateAccount = (..._: any[]): void => {}
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
        openPopup({ type: 'createAccount', props: { onCreate: onCreateAccount } })
    }
</script>

<Modal bind:this={modal} classes="transform -translate-x-1/2" size="large" position={{ top: '32px', left: '50%' }}>
    <div class="p-4">
        <div class="accounts flex flex-col space-y-1 scrollable-y">
            {#each accounts as account}
                <button
                    on:click={() => handleAccountClick(account.id)}
                    class="{account.id === $selectedAccount?.id
                        ? 'bg-gray-50 dark:bg-gray-800'
                        : ''} hover:bg-gray-50 dark:hover:bg-gray-800 flex flex-row items-center space-x-4 p-4 rounded"
                >
                    <div class="circle" style="--account-color: {getColor($activeProfile, account.id)};" />
                    <Text secondary={account.id !== $selectedAccount?.id} type="h5">{account.alias}</Text>
                </button>
            {/each}
        </div>
    </div>
    <HR />
    <button
        class="w-full hover:bg-gray-50 dark:hover:bg-gray-800 flex flex-row items-center space-x-2 px-7 py-4"
        on:click={handleCreateAccountClick}
    >
        <Icon icon="plus" height="12" width="12" classes="text-blue-500" />
        <Text highlighted type="p" classes="text-14">{localize('general.createNewWallet')}</Text>
    </button>
</Modal>

<style type="text/scss">
    .accounts {
        max-height: 60vh;
    }
    button {
        .circle {
            @apply relative;
            @apply rounded-full;
            @apply w-3;
            @apply h-3;
            background-color: var(--account-color);
            &:after {
                @apply absolute;
                @apply rounded-full;
                @apply w-3;
                @apply h-3;
                @apply border-2;
                @apply border-solid;
                @apply border-gray-700;
                @apply bg-transparent;
                @apply opacity-10;
                @apply top-1/2;
                @apply left-1/2;
                @apply transform;
                @apply -translate-x-1/2;
                @apply -translate-y-1/2;
                content: '';
            }
        }
    }
</style>
