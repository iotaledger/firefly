<script lang="typescript">
    import { AccountTile, Button, Text } from 'shared/components'
    import { activeProfile } from 'shared/lib/profile'
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

    $: waitingChrysalis = $activeProfile?.migratedTransactions?.length

    function handleAccountClick(accountId) {
        selectedAccountId.set(accountId)
        walletRoute.set(WalletRoutes.Account)
        accountRoute.set(AccountRoutes.Init)
    }
    function handleCreateClick() {
        walletRoute.set(WalletRoutes.CreateAccount)
    }
    function handleSendClick() {
        walletRoute.set(WalletRoutes.Send)
    }
    function handleReceiveClick() {
        walletRoute.set(WalletRoutes.Receive)
    }
</script>

{#if $walletRoute === WalletRoutes.Init}
    <div class="p-8 pt-4 flex flex-col h-full justify-between">
        <div data-label="accounts" class="w-full h-full flex flex-col flex-no-wrap justify-start mb-6">
            <div class="flex flex-row mb-4 justify-between items-center">
                <Text type="h5">{locale('general.myAccounts')}</Text>
                <Button disabled={waitingChrysalis} onClick={handleCreateClick} secondary small showHoverText icon="plus">
                    {locale('actions.create')}
                </Button>
            </div>
            {#if $accounts.length > 0}
                <div
                    class="grid grid-cols-{$accounts.length <= 2 ? $accounts.length : '3'} auto-rows-max {$accounts.length <= 2 ? 'gap-4' : 'gap-2.5'} w-full flex-auto overflow-y-auto h-1 -mr-2 pr-2 scroll-secondary">
                    {#each $accounts as account}
                        <AccountTile
                            color={account.color}
                            name={account.alias}
                            balance={account.balance}
                            balanceEquiv={account.balanceEquiv}
                            size={$accounts.length >= 3 ? 's' : $accounts.length === 2 ? 'm' : 'l'}
                            disabled={waitingChrysalis}
                            onClick={() => handleAccountClick(account.id)} />
                    {/each}
                </div>
            {:else}
                <Text>{locale('general.noAccounts')}</Text>
            {/if}
        </div>
        {#if $accounts.length > 0}
            <!-- Action Send / Receive -->
            <div class="flex flex-row justify-between space-x-4">
                <Button disabled={waitingChrysalis} xl secondary icon="receive" classes="w-1/2" onClick={handleReceiveClick}>
                    {locale('actions.receive')}
                </Button>
                <Button disabled={waitingChrysalis} xl secondary icon="send" classes="w-1/2" onClick={handleSendClick}>
                    {locale('actions.send')}
                </Button>
            </div>
        {/if}
    </div>
{:else if $walletRoute === WalletRoutes.Send}
    <Send {send} {internalTransfer} {locale} />
{:else if $walletRoute === WalletRoutes.Receive}
    <Receive {isGeneratingAddress} {generateAddress} {locale} />
{/if}
