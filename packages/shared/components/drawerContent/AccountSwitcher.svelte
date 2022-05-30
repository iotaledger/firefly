<script lang="typescript">
    import { HR, Icon, Text } from 'shared/components'

    import { localize } from '@core/i18n'
    import { resetAccountRouter } from '@core/router'

    import { mobile } from '@lib/app'
    import { showAppNotification } from '@lib/notifications'
    import { participationAction } from '@lib/participation/stores'
    // import { openPopup } from '@lib/popup'
    import { activeProfile, getColor } from '@lib/profile'
    import { WalletAccount } from '@lib/typings/wallet'
    import { isSyncing, isTransferring, selectedAccount, setSelectedAccount } from '@lib/wallet'

    export let accounts: WalletAccount[] = []
    // export let onCreateAccount = (..._: any[]): void => {}
    export let handleCreateAccountPress: (..._: any[]) => void
    export let onAccountSelection: (..._: any[]) => void

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
            onAccountSelection()
        }
    }

    function showWarning(message: string): void {
        showAppNotification({
            type: 'warning',
            message,
        })
    }

    function handleCreateAccountClick(): void {
        // Intentionally hidden to remember that we could use a popup too.
        // openPopup({ type: 'createAccount', props: { onCreate: onCreateAccount } })
        // onAccountSelection()
        handleCreateAccountPress()
    }
</script>

<div class="mb-4">
    <Text type="h4">{localize('general.switchWallet')}</Text>
</div>
<div class="accounts flex flex-col space-y-1 {$mobile ? 'overflow-auto mb-5' : 'scrollable-y'}">
    {#each accounts as account}
        <button
            on:click={() => handleAccountClick(account.id)}
            class="hover:bg-gray-50 dark:hover:bg-gray-800 flex flex-row items-center space-x-4 p-4 rounded"
        >
            <div class="circle" style="--account-color: {getColor($activeProfile, account.id)};" />
            <Text classes={account.id !== $selectedAccount?.id ? 'opacity-50' : ''} type="h5">{account.alias}</Text>
        </button>
    {/each}
</div>
<HR />
<button
    class="flex flex-row w-full hover:bg-gray-50 dark:hover:bg-gray-800 items-center space-x-2 px-4 py-6"
    on:click={handleCreateAccountClick}
>
    <Icon icon="plus" height="16" width="16" classes="text-blue-500" />
    <Text highlighted type="h5">{localize('general.createNewWallet')}</Text>
</button>

<style type="text/scss">
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
                @apply border;
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
