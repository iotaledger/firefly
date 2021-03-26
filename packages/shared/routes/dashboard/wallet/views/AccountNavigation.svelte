<script lang="typescript">
    import { Icon, Text } from 'shared/components'
    import { getInitials } from 'shared/lib/helpers'
    import { accountRoute, walletRoute } from 'shared/lib/router'
    import { AccountRoutes, WalletRoutes } from 'shared/lib/typings/routes'
    import { selectedAccountId, selectedMessage } from 'shared/lib/wallet'
    import { onDestroy, onMount } from 'svelte'

    export let locale
    export let accounts: {
        id: string
        alias: string
        color: string
        active: boolean
    }[]

    let rootElement
    let buttonElement
    let accountElement

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

    const calculateWidth = () => {
        // By setting the root element width it removes the need to use absolute positioning
        rootElement.style.width = `${window.document.body.clientWidth - 160}px`
        // If we don't show the scroll bar for the account container we align the accounts right
        // if there is a scroll container they need to be left aligned
        // We calculate if scroll is needed by comparing the account element width
        // to that of the back button container, all 3 items across the navigation
        // are equally sized
        accountElement.parentNode.style.justifyContent =
            accountElement.clientWidth > buttonElement.clientWidth ? 'flex-start' : 'flex-end'
    }

    onMount(() => {
        calculateWidth()

        window.addEventListener('resize', calculateWidth)
    })

    onDestroy(() => {
        window.removeEventListener('resize', calculateWidth)
    })
</script>

<style type="text/scss">
    button {
        + button {
            @apply ml-4;
        }
    }
</style>

<div class="flex flex-row justify-between items-start py-5" bind:this={rootElement}>
    <button data-label="back-button" class="flex-1 mt-1" on:click={handleBackClick} bind:this={buttonElement}>
        <div class="flex items-center space-x-3">
            <Icon icon="arrow-left" classes="text-blue-500" />
            <Text type="h5">{locale('actions.back')}</Text>
        </div>
    </button>
    <Text type="h3" classes="flex-1 text-center mt-1 mx-5">{activeAccount.alias}</Text>
    <div class="flex-1 flex flex-row justify-end overflow-x-auto">
        <div class="flex flex-row pb-1" bind:this={accountElement}>
            {#each accounts.concat(accounts).concat(accounts).concat(accounts).concat(accounts) as acc}
                <button
                    on:click={() => handleAccountClick(acc.id)}
                    class="w-10 h-10 rounded-xl p-2 text-14 leading-100 font-bold text-center
            {activeAccount.id === acc.id ? `bg-${acc.color}-500 text-white` : 'bg-gray-200 dark:bg-gray-700 text-gray-500'} 
            hover:bg-{acc.color}-500 hover:text-white">{getInitials(acc.alias, 2)}
                </button>
            {/each}
        </div>
    </div>
</div>
