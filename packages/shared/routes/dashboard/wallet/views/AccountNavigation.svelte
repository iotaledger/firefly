<script lang="typescript">
    import { Icon, Text, WalletPill } from 'shared/components'
    import { resetWalletRoute } from '@core/router'
    import { selectedAccountId, selectedMessage } from 'shared/lib/wallet'
    import { onDestroy, onMount } from 'svelte'
    import { Locale } from 'shared/lib/typings/i18n'

    export let locale: Locale

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
        resetWalletRoute()
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

<div class="flex flex-row justify-between items-start py-5" bind:this={rootElement}>
    <button data-label="back-button" class="flex-1 mt-1" on:click={handleBackClick} bind:this={buttonElement}>
        <div class="flex items-center space-x-3">
            <Icon icon="arrow-left" classes="text-blue-500" />
            <Text type="h5">{locale('actions.back')}</Text>
        </div>
    </button>
    <Text type="h3" classes="flex-1 text-center mt-1 mx-5">{activeAccount.alias}</Text>
    <div class="flex-1 flex flex-row justify-end overflow-x-auto scroll-tertiary">
        <div class="flex flex-row pb-1 space-x-4" bind:this={accountElement}>
            {#each accounts as acc}
                <WalletPill
                    account={acc}
                    active={activeAccount.id === acc.id}
                    onClick={() => handleAccountClick(acc.id)}
                />
            {/each}
        </div>
    </div>
</div>

<style type="text/scss">
    button {
        + button {
            @apply ml-4;
        }
    }
</style>
