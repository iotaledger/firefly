<script lang="typescript">
    import { localize } from '@core/i18n'
    import { showAppNotification } from '@lib/notifications'
    import { participationAction } from '@lib/participation/stores'
    import { WalletAccount } from 'shared/lib/typings/wallet'
    import { AccountSwitcherModal, Icon, Text, Modal } from 'shared/components'
    import { activeProfile, getColor } from 'shared/lib/profile'
    import { isSyncing, isTransferring, selectedAccount } from 'shared/lib/wallet'

    export let accounts: WalletAccount[] = []
    export let onCreateAccount = (..._: any[]): void => {}

    let modal: Modal
    let isModalOpened: boolean

    function onClick(): void {
        let message: string
        if ($isSyncing) {
            message = localize('notifications.syncing')
        } else if ($isTransferring) {
            message = localize('notifications.transferring')
        } else if ($participationAction) {
            message = localize('notifications.participating')
        } else {
            modal?.toggle()
            return
        }
        showAppNotification({
            type: 'warning',
            message,
        })
        modal?.close()
    }
</script>

<svelte:window on:click={() => (isModalOpened = modal?.isOpened())} />
<button on:click={onClick} class="flex flex-row justify-center items-center space-x-2">
    <div class="circle" style="--account-color: {getColor($activeProfile, $selectedAccount?.id)};" />
    <Text type="h4">{$selectedAccount?.alias}</Text>
    <div class="transform transition-all {isModalOpened ? 'rotate-180' : 'rotate-0'}">
        <Icon height="18" width="18" icon="chevron-down" classes="text-gray-800 dark:text-white" />
    </div>
</button>
<AccountSwitcherModal {onCreateAccount} {accounts} bind:modal />

<style type="text/scss">
    button {
        .circle {
            @apply rounded-full;
            @apply w-3;
            @apply h-3;
            background-color: var(--account-color);
        }
    }
</style>
