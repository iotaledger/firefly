<script lang="typescript">
    import { AccountTile, Button, Text } from 'shared/components'
    import { activeProfile, isSoftwareProfile } from 'shared/lib/profile'
    import { accountRoute, walletRoute } from 'shared/lib/router'
    import { AccountRoutes, WalletRoutes } from 'shared/lib/typings/routes'
    import { selectedAccountId, WalletAccount } from 'shared/lib/wallet'
    import { getContext } from 'svelte'
    import type { Readable } from 'svelte/store'
    import { Receive, Send } from '.'

    export let locale
    export let send
    export let internalTransfer
    export let generateAddress
    export let isGeneratingAddress

    const viewableAccounts = getContext<Readable<WalletAccount[]>>('viewableAccounts')
    const hiddenAccounts = $activeProfile?.hiddenAccounts ?? []

    $: waitingChrysalis = $activeProfile?.migratedTransactions?.length

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
                <Button disabled={waitingChrysalis} onClick={handleCreateClick} secondary small showHoverText icon="plus">
                    {locale('actions.create')}
                </Button>
            </div>
            {#if $viewableAccounts.length > 0}
                <div
                    class="grid {$viewableAccounts.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} auto-rows-max gap-4 flex-auto overflow-y-auto h-1 -mr-2 pr-2 scroll-secondary">
                    {#each $viewableAccounts as account}
                        <AccountTile
                            color={account.color}
                            name={account.alias}
                            balance={account.balance}
                            balanceEquiv={account.balanceEquiv}
                            size={$viewableAccounts.length === 1 ? 'l' : 'm'}
                            hidden={hiddenAccounts.includes(account.id)}
                            disabled={waitingChrysalis}
                            onClick={() => handleAccountClick(account.id)}
                            ledger={!$isSoftwareProfile} />
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
