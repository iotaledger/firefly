<script lang="typescript">
    import { Icon, Text, WalletPill } from 'shared/components'
    import { localize } from 'shared/lib/i18n'
    import type { WalletAccount } from 'shared/lib/typings/wallet'
    import { selectedAccount, selectedMessage, setSelectedAccount } from 'shared/lib/wallet'
    import { getContext, onDestroy, onMount } from 'svelte'
    import type { Readable } from 'svelte/store'

    let rootElement
    let buttonElement
    let accountElement

    const viewableAccounts = getContext<Readable<WalletAccount[]>>('viewableAccounts')

    function handleAccountClick(accountId) {
        setSelectedAccount(accountId)
        selectedMessage.set(null)
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
    <button data-label="back-button" class="flex-1 mt-1" on:click={() => {}} bind:this={buttonElement}>
        <div class="flex items-center space-x-3">
            <Icon icon="arrow-left" classes="text-blue-500" />
            <Text type="h5">{localize('actions.back')}</Text>
        </div>
    </button>
    <Text type="h3" classes="flex-1 text-center mt-1 mx-5">{$selectedAccount?.alias}</Text>
    <div class="flex-1 flex flex-row justify-end overflow-x-auto scroll-tertiary">
        <div class="flex flex-row pb-1 space-x-4" bind:this={accountElement}>
            {#each $viewableAccounts as acc}
                <WalletPill
                    account={acc}
                    active={$selectedAccount?.id === acc.id}
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
