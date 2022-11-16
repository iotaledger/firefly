<script lang="typescript">
    import { HR, BalanceSummarySection, Text, FontWeight, Button } from 'shared/components'
    import { selectedAccount } from '@core/account'
    import { localize } from '@core/i18n'
    import { closePopup, openPopup } from '@auxiliary/popup'
    import { checkActiveProfileAuth } from '@core/profile'
    import { consolidateOutputs } from '@core/wallet/actions/consolidateOutputs'

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
    <Button onClick={handleConsolidation}
        >{localize('popups.storageDepositBreakdown.minimizeStorageDepositButton')}</Button
    >
</div>
