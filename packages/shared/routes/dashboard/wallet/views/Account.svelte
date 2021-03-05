<script lang="typescript">
    import { AccountActionsModal, DashboardPane } from 'shared/components'
    import type { AccountMessage, WalletAccount } from 'shared/lib/wallet'
    import { getContext } from 'svelte'
    import type { Readable, Writable } from 'svelte/store'
    import { AccountActions, AccountBalance, AccountHistory, AccountNavigation, BarChart, LineChart } from '.'

    export let locale
    export let send
    export let internalTransfer
    export let generateAddress
    export let setAlias
    export let isGeneratingAddress

    const account = getContext<Readable<WalletAccount>>('selectedAccount')
    const accounts = getContext<Writable<WalletAccount[]>>('walletAccounts')
    const walletTransactions = getContext<Readable<AccountMessage[]>>('walletTransactions')

    $: transactions = $account ? $walletTransactions.filter((tx) => tx.account === $account.index) : []
    $: navAccounts = $account ? $accounts.map(({ id, alias, color }) => ({ id, alias, color, active: $account.id === id })) : []

    let showActionsModal = false

    const handleMenuClick = () => {
        showActionsModal = !showActionsModal
    }
</script>

<!-- wait for account to load -->
{#if $accounts && $account}
    <div class="w-full h-full flex flex-col flex-nowrap px-10 pb-10 relative flex-1">
        <AccountNavigation {locale} accounts={navAccounts} />
        {#key $account}
            <div class="w-full h-full grid grid-cols-3 gap-x-4 min-h-0">
                <DashboardPane classes=" h-full flex flex-auto flex-col flex-shrink-0">
                    <AccountBalance
                        {locale}
                        color={$account.color}
                        balance={$account.balance}
                        balanceEquiv={$account.balanceEquiv}
                        onMenuClick={handleMenuClick} />
                    <DashboardPane classes="h-full -mt-5">
                        <AccountActions {isGeneratingAddress} {send} {internalTransfer} {generateAddress} {setAlias} {locale} />
                    </DashboardPane>
                </DashboardPane>
                <DashboardPane>
                    <AccountHistory {locale} color={$account.color} {transactions} />
                </DashboardPane>
                <div class=" flex flex-col space-y-4">
                    <DashboardPane classes="w-full h-1/2">
                        <LineChart {locale} />
                    </DashboardPane>
                    <DashboardPane classes="w-full h-1/2">
                        <BarChart {locale} />
                    </DashboardPane>
                </div>
            </div>
        {/key}
        <AccountActionsModal bind:isActive={showActionsModal} {locale} />
    </div>
{/if}
