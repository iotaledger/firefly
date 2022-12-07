<script lang="typescript">
    import { closePopup, openPopup } from '@auxiliary/popup'
    import { selectedAccount } from '@core/account'
    import { localize } from '@core/i18n'
    import { checkActiveProfileAuth } from '@core/profile'
    import { selectedAccountAssets } from '@core/wallet'
    import { consolidateOutputs } from '@core/wallet/actions/consolidateOutputs'
    import { getStorageDepositFromOutput } from '@core/wallet/utils/generateActivity/helper'
    import type { AccountBalance } from '@iota/wallet'
    import { BalanceSummarySection, Button, FontWeight, HR, Text } from 'shared/components'

    $: ({ baseCoin } = $selectedAccountAssets)

    let accountBalance: AccountBalance
    $: $selectedAccount, void getAccountBalance()
    async function getAccountBalance(): Promise<void> {
        accountBalance = await await $selectedAccount.getBalance()
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
        openPopup({
            type: 'confirmation',
            props: {
                title: localize('popups.minimizeStorageDeposit.title'),
                description: localize('popups.minimizeStorageDeposit.description'),
                confirmText: localize('popups.minimizeStorageDeposit.confirmButton'),
                info: true,
                onConfirm: () => {
                    checkActiveProfileAuth(async () => {
                        await consolidateOutputs()
                        closePopup()
                    })
                },
            },
        })
    }
</script>

<div class="flex flex-col space-y-6">
    <Text type="h3" fontWeight={FontWeight.semibold} lineHeight="6">
        {localize('popups.storageDepositBreakdown.title')}
    </Text>
    <div class="flex flex-col space-y-4">
        <HR hidden />
        <BalanceSummarySection
            title={localize('popups.storageDepositBreakdown.basicOutputs.title')}
            subtitle={localize('popups.storageDepositBreakdown.basicOutputs.subtitle')}
            amount={Number(accountBalance?.requiredStorageDeposit?.basic ?? 0)}
            asset={baseCoin}
        />
        <HR hidden />
        <BalanceSummarySection
            title={localize('popups.storageDepositBreakdown.nftOutputs.title')}
            subtitle={localize('popups.storageDepositBreakdown.nftOutputs.subtitle')}
            amount={Number(accountBalance?.requiredStorageDeposit?.nft ?? 0)}
            asset={baseCoin}
        />
        <HR hidden />
        <BalanceSummarySection
            title={localize('popups.storageDepositBreakdown.aliasOutputs.title')}
            subtitle={localize('popups.storageDepositBreakdown.aliasOutputs.subtitle')}
            amount={Number(accountBalance?.requiredStorageDeposit?.alias ?? 0)}
            asset={baseCoin}
        />
        <HR hidden />
        <BalanceSummarySection
            title={localize('popups.storageDepositBreakdown.foundryOutputs.title')}
            subtitle={localize('popups.storageDepositBreakdown.foundryOutputs.subtitle')}
            amount={Number(accountBalance?.requiredStorageDeposit?.foundry ?? 0)}
            asset={baseCoin}
        />
        <HR hidden />
        <BalanceSummarySection
            title={localize('popups.storageDepositBreakdown.pendingTransactions.title')}
            subtitle={localize('popups.storageDepositBreakdown.pendingTransactions.subtitle')}
            amount={potentiallyLockedOutputsStorageDeposit}
            asset={baseCoin}
        />
        <HR hidden />
        <BalanceSummarySection
            title={localize('popups.storageDepositBreakdown.totalStorageDeposit')}
            amount={totalStorageDeposit}
            asset={baseCoin}
            totalRow
        />
    </div>
    <Button onClick={handleConsolidation}>
        {localize('popups.storageDepositBreakdown.minimizeStorageDepositButton')}
    </Button>
</div>
