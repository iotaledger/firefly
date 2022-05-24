<script lang="typescript">
    import { FontWeightText } from 'shared/components/Text.svelte'
    import { HR, BalanceSummarySection, Text } from 'shared/components'
    import { selectedAccount } from '@core/account'
</script>

<div class="flex flex-col space-y-6">
    <Text type="h3" fontWeight={FontWeightText.semibold} lineHeight="24">Storage deposit breakdown</Text>
    <HR hidden />
    <BalanceSummarySection
        title="Locked in pending transactions"
        subtitle="For sending native assets and small IOTA amounts"
        amount={(Number($selectedAccount?.balances.total) ?? 0) - Number($selectedAccount?.balances.available ?? 0)}
    />
    <HR hidden />
    <BalanceSummarySection
        title="Total storage deposit"
        amount={$selectedAccount.balances.requiredStorageDeposit}
        totalRow
    />
</div>
