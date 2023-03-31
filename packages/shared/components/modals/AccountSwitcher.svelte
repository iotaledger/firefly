<script lang="typescript">
    import { HR, Icon, Modal, Text } from 'shared/components'
    import { localize } from '@core/i18n'
    import { resetAccountRouter } from '@core/router'
    import { showAppNotification } from '@lib/notifications'
    import { isChangingParticipation, participationAction } from '@lib/participation/stores'
    import { openPopup } from '@lib/popup'
    import { getAccountColor } from '@lib/profile'
    import { WalletAccount } from '@lib/typings/wallet'
    import {
        accountSyncingQueueStore,
        isTransferring,
        selectedAccountStore,
        setSelectedAccount,
        updateAccountSyncingQueue,
        wallet,
    } from '@lib/wallet'

    export let accounts: WalletAccount[] = []
    export let onCreateAccount = (..._: any[]): void => {}
    export let modal: Modal

    const { balanceOverview } = $wallet

    function handleAccountClick(accountId: string): void {
        if ($isTransferring) {
            showWarning(localize('notifications.transferring'))
        } else if ($participationAction || $isChangingParticipation) {
            showWarning(localize('notifications.participating'))
        } else {
            setSelectedAccount(accountId)

            if ($accountSyncingQueueStore?.length > 1) {
                updateAccountSyncingQueue($selectedAccountStore)
            }

            resetAccountRouter(false)
        }
        modal?.close()
    }

    function showWarning(message: string) {
        showAppNotification({
            type: 'warning',
            message,
        })
    }

    function handleCreateAccountClick(): void {
        if ($isTransferring) {
            showWarning(localize('notifications.transferringCreate'))
        } else if ($participationAction || $isChangingParticipation) {
            showWarning(localize('notifications.participatingCreate'))
        } else {
            openPopup({ type: 'createAccount', props: { onCreate: onCreateAccount } })
        }
        modal?.close()
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
                        <div class="circle" style="--account-color: {getAccountColor(account.id)};" />
                        <Text classes={account.id !== $selectedAccountStore?.id ? 'opacity-50' : ''} type="h5">
                            {account.alias}
                        </Text>
                    </div>
                    <Text classes={account.id !== $selectedAccountStore?.id ? 'opacity-50' : ''} type="h5">
                        {account.balance}
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
            {localize('general.total', { values: { balance: $balanceOverview.balance } })}
        </Text>
    </button>
</Modal>

<style type="text/scss">
    .accounts {
        max-height: 65vh;
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
