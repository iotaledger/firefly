<script lang="typescript">
    import { getContext } from 'svelte'
    import { DashboardPane, AccountActionsModal } from 'shared/components'
    import { AccountNavigation, AccountBalance, AccountActions, AccountHistory } from '.'

    export let locale
    export let send
    export let internalTransfer
    export let generateAddress
    export let setAlias

    const account = getContext('selectedAccount')
    const accounts = getContext('walletAccounts')
    const walletTransactions = getContext('walletTransactions')

    $: transactions = $account ? $walletTransactions.filter((tx) => tx.account === $account.index) : []
    $: navAccounts = $account ? $accounts.map(({ id, name, color }) => ({ id, name, color, active: $account.id === id })) : []

    let showActionsModal = false

    const handleMenuClick = () => {
        showActionsModal = !showActionsModal
    }
</script>

<!-- wait for account to load -->
{#if $accounts && $account}
    <div class="w-full h-full flex flex-col flex-nowrap px-10 pb-10 relative">
        <AccountNavigation {locale} accounts={navAccounts} />
        {#key $account}
            <div class="w-full h-full grid grid-cols-3 gap-x-4">
                <DashboardPane classes=" h-full flex flex-auto flex-col flex-shrink-0">
                    <AccountBalance
                        {locale}
                        color={$account.color}
                        balance={$account.balance}
                        balanceEquiv={$account.balanceEquiv}
                        onMenuClick={handleMenuClick} />
                    <DashboardPane classes="h-full -mt-5">
                        <AccountActions {send} {internalTransfer} {generateAddress} {setAlias} {locale} />
                    </DashboardPane>
                </DashboardPane>
                <DashboardPane>
                    <AccountHistory {locale} color={$account.color} {transactions} />
                </DashboardPane>
                <div class=" flex flex-col space-y-4">
                    <!-- TODO Account Value -->
                    <DashboardPane classes="h-1/2 w-full" />
                    <!-- TODO  Account Activity -->
                    <DashboardPane classes="h-1/2 w-full" />
                </div>
            </div>
        {/key}
        <AccountActionsModal bind:isActive={showActionsModal} {locale} />
    </div>
{/if}
