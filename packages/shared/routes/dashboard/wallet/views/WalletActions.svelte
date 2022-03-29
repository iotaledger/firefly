<script lang="typescript">
    import { getContext } from 'svelte'
    import { Readable } from 'svelte/store'
    import { AccountTile, Button, Drawer, Icon, Text } from 'shared/components'
    import { mobile } from 'shared/lib/app'
    import { assemblyStakingRewards, shimmerStakingRewards } from 'shared/lib/participation/stores'
    import { StakingAirdrop } from 'shared/lib/participation/types'
    import { activeProfile, getColor, isLedgerProfile } from 'shared/lib/profile'
    import { accountRouter, AccountRoute, walletRoute, walletRouter, WalletRoute } from '@core/router'
    import { Locale } from 'shared/lib/typings/i18n'
    import { WalletAccount } from 'shared/lib/typings/wallet'
    import { selectedAccountId } from 'shared/lib/wallet'
    import { Receive, Send } from '.'

    export let locale: Locale

    export let onSend = (..._: any[]): void => {}
    export let onInternalTransfer = (..._: any[]): void => {}
    export let onGenerateAddress = (..._: any[]): void => {}

    export let isGeneratingAddress: boolean

    let drawer: Drawer

    $: if (
        ($mobile && drawer && $walletRoute === WalletRoute.Receive) ||
        (drawer && $walletRoute === WalletRoute.Send)
    ) {
        drawer.open()
    }

    const viewableAccounts = getContext<Readable<WalletAccount[]>>('viewableAccounts')
    const hiddenAccounts = $activeProfile?.hiddenAccounts ?? []

    function handleAccountClick(accountId: string) {
        selectedAccountId.set(accountId)
        $walletRouter.goTo(WalletRoute.Account)
        $accountRouter.goTo(AccountRoute.Init)
    }
    function handleCreateClick() {
        $walletRouter.goTo(WalletRoute.CreateAccount)
    }
</script>

{#if $mobile}
    {#if $walletRoute === WalletRoute.Init || $walletRoute === WalletRoute.Send || $walletRoute === WalletRoute.Receive || $walletRoute === WalletRoute.CreateAccount}
        <div class="p-8 pt-4 flex flex-col h-full justify-between">
            <div data-label="accounts" class="w-full h-full flex flex-col flex-no-wrap justify-start">
                <div class="flex flex-row mb-4 justify-between items-center">
                    <button id="add-wallet" on:click={handleCreateClick} class="bg-white dark:bg-blue-500 z-10">
                        <Icon icon="plus" classes="text-blue-500 dark:text-white" width="18" height="18" />
                    </button>
                </div>
                {#if $viewableAccounts.length > 0}
                    <div
                        class="grid {$viewableAccounts.length === 1
                            ? 'grid-cols-1'
                            : 'grid-cols-2'} auto-rows-max gap-4 flex-auto overflow-y-auto pr-2 scroll-secondary"
                    >
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
                            />
                        {/each}
                    </div>
                {:else}
                    <Text classes="text-right">{locale('general.noAccounts')}</Text>
                {/if}
            </div>
        </div>
        <Drawer dimLength={180} opened={false} bind:this={drawer} on:close={() => walletRoute.set(WalletRoute.Init)}>
            {#if $walletRoute === WalletRoute.Send}
                <Send {onSend} {onInternalTransfer} {locale} />
            {:else if $walletRoute === WalletRoute.Receive}
                <Receive {isGeneratingAddress} {onGenerateAddress} {locale} />
            {/if}
        </Drawer>
    {/if}
{:else if $walletRoute === WalletRoute.Init}
    <div class="p-8 pt-4 flex flex-col h-full justify-between">
        <div data-label="accounts" class="w-full h-full flex flex-col flex-no-wrap justify-start">
            <div class="flex flex-row mb-4 justify-between items-center">
                <Text type="h5">{locale('general.myAccounts')}</Text>
                <Button onClick={handleCreateClick} secondary small showHoverText icon="plus">
                    {locale('actions.create')}
                </Button>
            </div>
            {#if $viewableAccounts.length > 0}
                <div
                    class="grid {$viewableAccounts.length === 1 && !$assemblyStakingRewards && !$shimmerStakingRewards
                        ? 'grid-cols-1'
                        : 'grid-cols-2'} auto-rows-max gap-4 flex-auto overflow-y-auto h-1 -mr-2 pr-2 scroll-secondary"
                >
                    {#each $viewableAccounts as account}
                        <AccountTile
                            color={getColor($activeProfile, account.id)}
                            name={account.alias}
                            balance={account.balance}
                            balanceEquiv={account.balanceEquiv}
                            size={$viewableAccounts.length === 1 &&
                            (!$assemblyStakingRewards || !$shimmerStakingRewards)
                                ? 'l'
                                : 'm'}
                            hidden={hiddenAccounts.includes(account.id)}
                            onClick={() => handleAccountClick(account.id)}
                        />
                    {/each}
                    {#if $assemblyStakingRewards}
                        <AccountTile airdrop={StakingAirdrop.Assembly} balance={$assemblyStakingRewards} size="m" />
                    {/if}
                    {#if $shimmerStakingRewards}
                        <AccountTile airdrop={StakingAirdrop.Shimmer} balance={$shimmerStakingRewards} size="m" />
                    {/if}
                </div>
            {:else}
                <Text>{locale('general.noAccounts')}</Text>
            {/if}
        </div>
    </div>
{:else if $walletRoute === WalletRoute.Send}
    <Send {onSend} {onInternalTransfer} {locale} />
{:else if $walletRoute === WalletRoute.Receive}
    <Receive {isGeneratingAddress} {onGenerateAddress} {locale} />
{/if}

<style type="text/scss">
    #add-wallet {
        width: 40px;
        height: 40px;
        padding: 11px;
        border-radius: 10px;
        box-shadow: 0px 2px 6px rgba(0, 25, 66, 0.08);
    }
</style>
