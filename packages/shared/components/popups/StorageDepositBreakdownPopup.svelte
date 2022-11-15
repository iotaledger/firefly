<script lang="typescript">
    import { closePopup, openPopup } from '@auxiliary/popup'
    import { selectedAccount } from '@core/account'
    import { localize } from '@core/i18n'
    import { selectedAccountNfts } from '@core/nfts'
    import { checkActiveProfileAuth } from '@core/profile'
    import { Output, selectedAccountAssets } from '@core/wallet'
    import { consolidateOutputs } from '@core/wallet/actions/consolidateOutputs'
    import { getStorageDepositFromOutput } from '@core/wallet/utils/generateActivity/helper'
    import { BalanceSummarySection, Button, FontWeight, HR, Text } from 'shared/components'

    $: ({ baseCoin } = $selectedAccountAssets)

    let accountBalance
    $: $selectedAccount, void getAccountBalance()
    async function getAccountBalance(): Promise<void> {
        accountBalance = await $selectedAccount.getBalance()
    }

    let potentiallyLockedOutputsStorageDeposit
    $: accountBalance, void calculatePendingTransactionStorageDeposit()
    async function calculatePendingTransactionStorageDeposit(): Promise<void> {
        potentiallyLockedOutputsStorageDeposit = 0
        for (const [outputId, unlocked] of Object.entries(accountBalance?.potentiallyLockedOutputs ?? {})) {
            if (!unlocked) {
                const output: Output = (await $selectedAccount.getOutput(outputId)).output
                const storageDeposit = getStorageDepositFromOutput(output).storageDeposit
                potentiallyLockedOutputsStorageDeposit += storageDeposit
            }
        }
    }

    let nftOutputsStorageDeposit
    $: accountBalance, void calculateNftOutputsStorageDeposit()
    function calculateNftOutputsStorageDeposit(): void {
        nftOutputsStorageDeposit = 0
        for (const nft of $selectedAccountNfts) {
            if (nft.isOwned) {
                nftOutputsStorageDeposit += nft.requiredStorageDeposit
            }
        }
    }

    function handleConsolidation(): void {
        openPopup({
            type: 'confirmation',
            props: {
                title: 'Consolidate Outputs',
                description: 'Consolidate outputs description',
                hint: 'Consolidate outputs hint',
                warning: true,
                confirmText: localize('actions.consolidate'),
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
        amount={potentiallyLockedOutputsStorageDeposit}
        asset={baseCoin}
    />
    <BalanceSummarySection
        title="Locked in NFTs"
        subtitle={'Resevered for storing NFTs'}
        amount={nftOutputsStorageDeposit}
        asset={baseCoin}
    />
    <HR hidden />
    <BalanceSummarySection
        title={localize('popups.storageDepositBreakdown.totalStorageDeposit')}
        amount={Number($selectedAccount.balances.requiredStorageDeposit) + potentiallyLockedOutputsStorageDeposit}
        asset={baseCoin}
        totalRow
    />
    <Button onClick={handleConsolidation}>Consolidate Balance</Button>
</div>
