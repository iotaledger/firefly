<script lang="typescript">
    import type { AccountIdentifier } from 'lib/typings/account'
    import { HR, Icon, Text } from 'shared/components'
    import { localize } from 'shared/lib/i18n'
    import { activeProfile, getColor } from 'shared/lib/profile'
    import type { WalletAccount } from 'shared/lib/typings/wallet'
    import { selectedAccount, selectedMessage, setSelectedAccount } from 'shared/lib/wallet'

    export let accounts: WalletAccount[] = []
    export let handleCreateAccountPress = (..._: any[]): void => {}
    export let onAccountSelection = (..._: any[]): void => {}

    const handleAccountClick = (accountId: AccountIdentifier): void => {
        setSelectedAccount(accountId)
        selectedMessage.set(null)
        onAccountSelection()
    }
</script>

<div class="flex flex-col px-6 py-10 w-full">
    <div class="mb-5">
        <Text type="h4">{localize('general.switchWallet')}</Text>
    </div>
    <div class="accounts flex flex-col space-y-1 scrollable-y">
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
        class="flex flex-row w-full hover:bg-gray-50 dark:hover:bg-gray-800 items-center space-x-2 px-4 py-6"
        on:click={handleCreateAccountPress}
    >
        <Icon icon="plus" height="16" width="16" classes="text-blue-500 mb-0.5" />
        <Text highlighted type="h5">{localize('general.createNewWallet')}</Text>
    </button>
</div>

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
