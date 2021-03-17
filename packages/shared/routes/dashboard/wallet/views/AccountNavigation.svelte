<script lang="typescript">
    import { Button, Text, Icon } from 'shared/components'
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
    <button data-label="back-button" class="absolute left-0" on:click={handleBackClick}>
        <div class="flex items-center space-x-3">
            <Icon icon="arrow-left" classes="text-blue-500" />
            <Text type="h4">{locale('actions.back')}</Text>
        </div>
    </button>
    <Text type="h3" classes="text-center">{activeAccount.alias}</Text>
    <div class="absolute right-0 flex flex-row space-x-4 account-switch">
        {#each accounts as acc}
            <button
                on:click={() => handleAccountClick(acc.id)}
                class="w-10 h-10 rounded-xl p-2 text-14 leading-100 font-bold text-center
                {activeAccount.id === acc.id ? `bg-${acc.color}-500 text-white` : 'bg-gray-200 text-gray-500'} 
                hover:bg-{acc.color}-500 hover:text-white">{getInitials(acc.alias, 2)}
            </button>
        {/each}
    </div>
</div>
