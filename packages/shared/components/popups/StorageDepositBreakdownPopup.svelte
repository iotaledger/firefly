<script lang="typescript">
    import { FontWeight } from 'shared/components/Text.svelte'
    import { HR, BalanceSummarySection, Text } from 'shared/components'
    import { selectedAccount } from '@core/account'
    import { localize } from '@core/i18n'
</script>

<div class="flex flex-col space-y-6">
    <Text type="h3" fontWeight={FontWeight.semibold} lineHeight="6">
        {localize('popups.storageDepositBreakdown.title')}
    </Text>
    <HR hidden />
    <BalanceSummarySection
        title={localize('popups.storageDepositBreakdown.pendingTransactions.title')}
        subtitle={localize('popups.storageDepositBreakdown.pendingTransactions.subtitle')}
        amount={(Number($selectedAccount?.balances.baseCoin.total) ?? 0) -
            Number($selectedAccount?.balances.baseCoin.available ?? 0)}
    />
    <HR hidden />
    <BalanceSummarySection
        title={localize('popups.storageDepositBreakdown.totalStorageDeposit')}
        amount={$selectedAccount.balances.requiredStorageDeposit}
        totalRow
    />
</div>
