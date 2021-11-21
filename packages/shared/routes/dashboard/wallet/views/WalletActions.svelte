<script lang="typescript">
    import { AccountTile, Button, Text } from 'shared/components'
    import { activeProfile, isLedgerProfile } from 'shared/lib/profile'
    import { accountRoute, walletRoute } from 'shared/lib/router'
    import { AccountRoutes, WalletRoutes } from 'shared/lib/typings/routes'
    import { selectedAccountId } from 'shared/lib/wallet'
    import { getContext } from 'svelte'
    import type { Readable } from 'svelte/store'
    import { Receive, Send } from '.'
    import { Locale } from 'shared/lib/typings/i18n'
    import { WalletAccount } from 'shared/lib/typings/wallet'
    import { isAccountStaked } from 'shared/lib/participation'

    export let locale: Locale

    export let onSend = (..._: any[]): void => {}
    export let onInternalTransfer = (..._: any[]): void => {}
    export let onGenerateAddress = (..._: any[]): void => {}

    export let isGeneratingAddress

    const viewableAccounts = getContext<Readable<WalletAccount[]>>('viewableAccounts')
    const hiddenAccounts = $activeProfile?.hiddenAccounts ?? []

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
                            onClick={() => handleAccountClick(account.id)}
                            ledger={$isLedgerProfile}
                            staked={isAccountStaked(account.id)}
                        />
                    {/each}
                </div>
            {:else}
                <Text>{locale('general.noAccounts')}</Text>
            {/if}
        </div>
    </div>
{:else if $walletRoute === WalletRoutes.Send}
    <Send {onSend} {onInternalTransfer} {locale} />
{:else if $walletRoute === WalletRoutes.Receive}
    <Receive {isGeneratingAddress} {onGenerateAddress} {locale} />
{/if}
