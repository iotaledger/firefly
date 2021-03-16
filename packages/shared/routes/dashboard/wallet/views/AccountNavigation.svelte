<script lang="typescript">
    import { Button, Text } from 'shared/components'
    import { getInitials } from 'shared/lib/helpers'
    import { accountRoute, walletRoute } from 'shared/lib/router'
    import { AccountRoutes, WalletRoutes } from 'shared/lib/typings/routes'
    import { selectedAccountId, selectedMessage } from 'shared/lib/wallet'

    export let locale
    export let accounts: {
        id: string
        alias: string
        color: string
        active: boolean
    }[]

    $: activeAccount = accounts.find((acc) => acc.active)

    function handleAccountClick(accountId) {
        selectedAccountId.set(accountId)
        selectedMessage.set(null)
    }
    function handleBackClick() {
        selectedAccountId.set(null)
        selectedMessage.set(null)
        walletRoute.set(WalletRoutes.Init)
        accountRoute.set(AccountRoutes.Init)
    }
</script>

<div class="relative flex flex-row justify-center items-center w-full py-5">
    <div class="absolute left-0">
        <Button secondary small icon="arrow-left" iconReverse onClick={handleBackClick}>{locale('actions.back')}</Button>
    </div>
    <Text type="h3" classes="text-center">{activeAccount.alias}</Text>
    <div class="absolute right-0 flex flex-row space-x-4 account-switch">
        {#each accounts as acc}
            <button
                on:click={() => handleAccountClick(acc.id)}
                class="w-10 h-10 rounded-xl p-2 text-14 leading-100 font-bold text-center
                {activeAccount.id === acc.id ? `bg-${acc.color}-500 text-white` : 'bg-gray-200 dark:bg-gray-700 dark:bg-opacity-20 text-gray-500'} 
                hover:bg-{acc.color}-500 dark:hover:bg-opacity-100 hover:text-white">{getInitials(acc.alias, 2)}
            </button>
        {/each}
    </div>
</div>
