<script lang="typescript">
    import { HR, Icon, Modal, Text } from 'shared/components'
    import { localize } from 'shared/lib/i18n'
    import { openPopup } from 'shared/lib/popup'
    import { activeProfile, getColor } from 'shared/lib/profile'
    import type { WalletAccount } from 'shared/lib/typings/wallet'
    import { selectedAccount, selectedMessage, setSelectedAccount } from 'shared/lib/wallet'

    export let isActive = false
    export let accounts: WalletAccount[] = []
    export let onAccountCreation = (..._: any[]): void => {}

    const handleAccountClick = (accountId: string): void => {
        setSelectedAccount(accountId)
        selectedMessage.set(null)
        isActive = false
    }

    const handleCreateAccountClick = (): void => {
        isActive = false
        openPopup({ type: 'accountCreation', props: { onAccountCreation } })
    }
</script>

<Modal bind:isActive classes="transform -translate-x-1/2" size="large" position={{ top: '32px', left: '50%' }}>
    <div class="accounts flex flex-col space-y-1 p-4 scrollable-y">
        {#each accounts as account}
            <button
                on:click={() => handleAccountClick(account.id)}
                class="{account.id === $selectedAccount?.id
                    ? 'bg-gray-50 dark:bg-gray-800'
                    : ''} hover:bg-gray-50 dark:hover:bg-gray-800 flex flex-row items-center space-x-4 p-4 rounded"
            >
                <div class="circle" style="--account-color: {getColor($activeProfile, account.id)};" />
                <Text secondary={account.id !== $selectedAccount?.id} type="h4">{account.alias}</Text>
            </button>
        {/each}
    </div>
    <HR />
    <button
        class="w-full hover:bg-gray-50 dark:hover:bg-gray-800 flex flex-row items-center space-x-2 px-7 py-4"
        on:click={handleCreateAccountClick}
    >
        <Icon icon="plus" height="12" width="12" classes="text-blue-500" />
        <Text highlighted type="p">{localize('general.createNewWallet')}</Text>
    </button>
</Modal>

<style type="text/scss">
    .accounts {
        max-height: 40vh;
    }
    button {
        .circle {
            @apply rounded-full;
            @apply w-3;
            @apply h-3;
            background-color: var(--account-color);
        }
    }
</style>
