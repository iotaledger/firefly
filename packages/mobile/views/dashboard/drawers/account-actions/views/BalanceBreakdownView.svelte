<script lang="typescript">
    import { selectedAccount } from '@core/account'
    import { localize } from '@core/i18n'
    import { selectedAccountAssets } from '@core/wallet'
    import { getStorageDepositFromOutput } from '@core/wallet/utils/generateActivity/helper'
    import type { AccountBalance } from '@iota/wallet'
    import { BalanceSummarySection, Button, HR } from 'shared/components'
    import { AccountAction } from '../../../../../lib/contexts/dashboard'
    import { accountActionsRouter } from '../../../../../lib/routers'

    $: ({ baseCoin } = $selectedAccountAssets)

    let accountBalance: AccountBalance
    $: $selectedAccount, void getAccountBalance()
    async function getAccountBalance(): Promise<void> {
        accountBalance = await $selectedAccount.getBalance()
    }

    let potentiallyLockedOutputsStorageDeposit: number
    $: accountBalance, void calculatePendingTransactionStorageDeposit()
    async function calculatePendingTransactionStorageDeposit(): Promise<void> {
        potentiallyLockedOutputsStorageDeposit = 0
        for (const [outputId, unlocked] of Object.entries(accountBalance?.potentiallyLockedOutputs ?? {})) {
            if (!unlocked) {
                const output = (await $selectedAccount.getOutput(outputId)).output
                const storageDeposit = getStorageDepositFromOutput(output).storageDeposit
                potentiallyLockedOutputsStorageDeposit += storageDeposit
            }
        }
    }

    $: totalStorageDeposit = accountBalance?.requiredStorageDeposit
        ? Object.values(accountBalance?.requiredStorageDeposit).reduce(
              (total: number, value: string): number => total + Number(value),
              potentiallyLockedOutputsStorageDeposit
          )
        : potentiallyLockedOutputsStorageDeposit

    function handleConsolidation(): void {
        $accountActionsRouter.next({ action: AccountAction.Consolidate })
    }
</script>

<div class="flex flex-col justify-between space-y-8 flex-1 relative">
    <div class="balance-breakdown flex flex-col overflow-y-auto flex-1 space-y-4">
        <HR hidden />
        <BalanceSummarySection
            title={localize('popups.balanceBreakdown.basicOutputs.title')}
            subtitle={localize('popups.balanceBreakdown.basicOutputs.subtitle')}
            amount={Number(accountBalance?.requiredStorageDeposit?.basic ?? 0)}
            asset={baseCoin}
        />
        <HR hidden />
        <BalanceSummarySection
            title={localize('popups.balanceBreakdown.nftOutputs.title')}
            subtitle={localize('popups.balanceBreakdown.nftOutputs.subtitle')}
            amount={Number(accountBalance?.requiredStorageDeposit?.nft ?? 0)}
            asset={baseCoin}
        />
        <HR hidden />
        <BalanceSummarySection
            title={localize('popups.balanceBreakdown.aliasOutputs.title')}
            subtitle={localize('popups.balanceBreakdown.aliasOutputs.subtitle')}
            amount={Number(accountBalance?.requiredStorageDeposit?.alias ?? 0)}
            asset={baseCoin}
        />
        <HR hidden />
        <BalanceSummarySection
            title={localize('popups.balanceBreakdown.foundryOutputs.title')}
            subtitle={localize('popups.balanceBreakdown.foundryOutputs.subtitle')}
            amount={Number(accountBalance?.requiredStorageDeposit?.foundry ?? 0)}
            asset={baseCoin}
        />
        <HR hidden />
        <BalanceSummarySection
            title={localize('popups.balanceBreakdown.pendingTransactions.title')}
            subtitle={localize('popups.balanceBreakdown.pendingTransactions.subtitle')}
            amount={potentiallyLockedOutputsStorageDeposit}
            asset={baseCoin}
        />
        <HR hidden />
        <BalanceSummarySection
            title={localize('popups.balanceBreakdown.totalStorageDeposit')}
            amount={totalStorageDeposit}
            asset={baseCoin}
            totalRow
        />
    </div>
    <Button onClick={handleConsolidation}>
        {localize('popups.balanceBreakdown.minimizeStorageDepositButton')}
    </Button>
</div>

<style type="text/scss">
    .balance-breakdown {
        max-height: calc(100vh - 200px);
    }
</style>
