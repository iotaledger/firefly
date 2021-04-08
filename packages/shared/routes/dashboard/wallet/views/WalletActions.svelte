<script lang="typescript">
    import { AccountTile, Button, Text } from 'shared/components'
    import { loggedIn } from 'shared/lib/app'
    import { closePopup, openPopup } from 'shared/lib/popup'
    import { accountRoute, walletRoute } from 'shared/lib/router'
    import { AccountRoutes, WalletRoutes } from 'shared/lib/typings/routes'
    import { selectedAccountId, WalletAccount } from 'shared/lib/wallet'
    import { getContext } from 'svelte'
    import type { Writable } from 'svelte/store'
    import { Receive, Send } from '.'

    export let locale
    export let send
    export let internalTransfer
    export let generateAddress
    export let isGeneratingAddress

    const accounts = getContext<Writable<WalletAccount[]>>('walletAccounts')
    const accountsLoaded = getContext<Writable<boolean>>('walletAccountsLoaded')

    let startInit

    if ($walletRoute === WalletRoutes.Init && !$accountsLoaded && $loggedIn) {
        startInit = Date.now()
        openPopup({
            type: 'busy',
            hideClose: true,
            fullScreen: true,
            transition: false,
        })
    }

    $: {
        if ($accountsLoaded) {
            const minTimeElapsed = 3000 - (Date.now() - startInit)
            if (minTimeElapsed < 0) {
                closePopup()
            } else {
                setTimeout(() => closePopup(), minTimeElapsed)
            }
        }
    }

    function handleAccountClick(accountId) {
        selectedAccountId.set(accountId)
        walletRoute.set(WalletRoutes.Account)
        accountRoute.set(AccountRoutes.Init)
    }
    function handleCreateClick() {
        walletRoute.set(WalletRoutes.CreateAccount)
    }
</script>

{#if $walletRoute === WalletRoutes.Init}
    <div class="p-8 pt-4 flex flex-col h-full justify-between">
        <div data-label="accounts" class="w-full h-full flex flex-col flex-no-wrap justify-start">
            <div class="flex flex-row mb-4 justify-between items-center">
                <Text type="h5">{locale('general.myAccounts')}</Text>
                <Button onClick={handleCreateClick} secondary small showHoverText icon="plus">{locale('actions.create')}</Button>
            </div>
            {#if $accounts.length > 0}
                <div
                    class="grid {$accounts.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} auto-rows-max gap-4 w-full flex-auto overflow-y-auto h-1 -mr-2 pr-2 scroll-secondary">
                    {#each $accounts as account}
                        <AccountTile
                            color={account.color}
                            name={account.alias}
                            balance={account.balance}
                            balanceEquiv={account.balanceEquiv}
                            size={$accounts.length === 1 ? 'l' : 'm'}
                            onClick={() => handleAccountClick(account.id)} />
                    {/each}
                </div>
            {:else}
                <Text>{locale('general.noAccounts')}</Text>
            {/if}
        </div>
    </div>
{:else if $walletRoute === WalletRoutes.Send}
    <Send {send} {internalTransfer} {locale} />
{:else if $walletRoute === WalletRoutes.Receive}
    <Receive {isGeneratingAddress} {generateAddress} {locale} />
{/if}
