<script lang="ts">
    import { closePopup, openPopup, PopupId } from '@auxiliary/popup'
    import { isVestingOutputId, selectedWalletVestingOverview } from '@contexts/vesting'
    import { localize } from '@core/i18n'
    import { getManaBalance } from '@core/network'
    import { checkActiveProfileAuth } from '@core/profile'
    import { selectedWallet } from '@core/wallet'
    import { consolidateOutputs } from '@core/wallet/actions/consolidateOutputs'
    import { getStorageDepositFromOutput } from '@core/wallet/utils/generateActivity/helper'
    import features from '@features/features'
    import { CommonOutput, OutputType, UnlockCondition, UnlockConditionType } from '@iota/sdk/out/types'
    import { BalanceSummarySection, Button, FontWeight, Text, TextType } from '@ui'
    import { TextHintVariant } from '@ui/enums'

    interface BalanceBreakdown {
        amount: number
        isBaseToken?: boolean
        subBreakdown?: { [key: string]: { amount: number } }
    }

    enum PendingFundsType {
        Unclaimed = 'unclaimed',
        StorageDepositReturn = 'storageDepositReturn',
        Timelock = 'timelock',
    }

    $: walletBalance = $selectedWallet?.balances
    $: walletBalance, void setBreakdown()

    let breakdown: { [key: string]: BalanceBreakdown } = {}

    async function setBreakdown(): Promise<void> {
        const availableBreakdown = getAvailableBreakdown()
        const pendingBreakdown = await getPendingBreakdown()
        const lockedBreakdown = getLockedBreakdown()
        const storageDepositBreakdown = getStorageDepositBreakdown()
        const vestingBreakdown = getVestingBreakdown()
        const manaBreakdown = getManaBreakdown()

        breakdown = {
            available: availableBreakdown,
            pending: pendingBreakdown,
            locked: lockedBreakdown,
            storageDeposit: storageDepositBreakdown,
            mana: manaBreakdown,
            ...(features.vesting.enabled && { vesting: vestingBreakdown }),
        }
    }

    function getAvailableBreakdown(): BalanceBreakdown {
        return { amount: Number(walletBalance?.baseCoin?.available ?? 0) }
    }

    function getManaBreakdown(): BalanceBreakdown {
        const totalPasiveMana = getManaBalance(walletBalance?.mana?.total)
        const availablePasiveBalance = getManaBalance(walletBalance?.mana?.available)
        const totalMana = totalPasiveMana + (walletBalance?.totalWalletBic ?? 0)
        const manaRewards = Number(walletBalance?.mana?.rewards ?? 0)

        const subBreakdown = {
            availableMana: { amount: availablePasiveBalance },
            lockedMana: { amount: totalPasiveMana - availablePasiveBalance },
            bicMana: { amount: walletBalance?.totalWalletBic },
            manaRewards: { amount: manaRewards },
        }
        return { amount: totalMana, subBreakdown, isBaseToken: false }
    }

    async function getPendingBreakdown(): Promise<BalanceBreakdown> {
        let pendingOutputsStorageDeposit = 0

        const subBreakdown = {}
        for (const [outputId, unlocked] of Object.entries(walletBalance?.potentiallyLockedOutputs ?? {})) {
            if (!unlocked) {
                const output = (await $selectedWallet.getOutput(outputId)).output

                let type: string
                let amount: number
                if (!isVestingOutputId(outputId)) {
                    const commonOutput = output as CommonOutput
                    if (containsUnlockCondition(commonOutput.unlockConditions, UnlockConditionType.Expiration)) {
                        type = PendingFundsType.Unclaimed
                        amount = Number(output.amount)
                    } else if (
                        containsUnlockCondition(commonOutput.unlockConditions, UnlockConditionType.StorageDepositReturn)
                    ) {
                        type = PendingFundsType.StorageDepositReturn
                        amount = (await getStorageDepositFromOutput(output as CommonOutput))?.storageDeposit
                    } else if (containsUnlockCondition(commonOutput.unlockConditions, UnlockConditionType.Timelock)) {
                        type = PendingFundsType.Timelock
                        amount = Number(output.amount)
                    }

                    if (type) {
                        if (!subBreakdown[type]) {
                            subBreakdown[type] = amount
                        } else {
                            subBreakdown[type] += amount
                        }
                    }
                }
                pendingOutputsStorageDeposit += amount
            }
        }

        return { amount: pendingOutputsStorageDeposit, subBreakdown }
    }

    function getLockedBreakdown(): BalanceBreakdown {
        const delegationOutputs =
            $selectedWallet?.walletUnspentOutputs?.filter((output) => output?.output?.type === OutputType.Delegation) ||
            []
        const implicitAccounts = $selectedWallet?.implicitAccountOutputs || []
        const delegatedAmount = Number(delegationOutputs.reduce((acc, prev) => acc + Number(prev.output.amount), 0))
        const implicitAccountsAmount = Number(
            implicitAccounts.reduce((acc, prev) => acc + Number(prev.output.amount), 0)
        )
        const totalLockedAmount = delegatedAmount + implicitAccountsAmount
        const subBreakdown = {
            delegation: { amount: delegatedAmount },
            implicitAccounts: { amount: implicitAccountsAmount },
        }
        return { amount: totalLockedAmount, subBreakdown }
    }

    function getStorageDepositBreakdown(): BalanceBreakdown {
        const storageDeposits = walletBalance?.requiredStorageDeposit
        const totalStorageDeposit = storageDeposits
            ? Object.values(walletBalance.requiredStorageDeposit).reduce(
                  (total: number, value: string): number => total + Number(value ?? 0),
                  0
              )
            : 0

        const subBreakdown = {
            basicOutputs: { amount: Number(storageDeposits?.basic ?? 0) },
            nftOutputs: { amount: Number(storageDeposits?.nft ?? 0) },
            accountOutputs: { amount: Number(storageDeposits?.account ?? 0) },
            foundryOutputs: { amount: Number(storageDeposits?.foundry ?? 0) },
        }

        return { amount: totalStorageDeposit, subBreakdown }
    }

    function getVestingBreakdown(): BalanceBreakdown {
        return { amount: $selectedWalletVestingOverview?.remainingPayout }
    }

    function containsUnlockCondition(unlockConditions: UnlockCondition[], unlockConditionId: number): boolean {
        return unlockConditions.some((unlockCondition) => unlockCondition.type === unlockConditionId)
    }

    function onConsolidationClick(): void {
        openPopup({
            id: PopupId.Confirmation,
            props: {
                title: localize('popups.minimizeStorageDeposit.title'),
                description: localize('popups.minimizeStorageDeposit.description'),
                confirmText: localize('popups.minimizeStorageDeposit.confirmButton'),
                variant: TextHintVariant.Info,
                onConfirm: async () => {
                    await checkActiveProfileAuth(
                        async () => {
                            await consolidateOutputs()
                            closePopup()
                        },
                        { stronghold: true }
                    )
                },
            },
        })
    }
</script>

<div class="flex flex-col space-y-6">
    <Text type={TextType.h3} fontWeight={FontWeight.semibold} lineHeight="6">
        {localize('popups.balanceBreakdown.title')}
    </Text>
    <div class="flex flex-col space-y-8">
        {#each Object.keys(breakdown) as breakdownKey}
            <BalanceSummarySection
                titleKey={breakdownKey}
                subtitleKey={breakdownKey}
                amount={breakdown[breakdownKey].amount}
                subBreakdown={breakdown[breakdownKey].subBreakdown}
                isBaseToken={breakdownKey !== 'mana'}
            />
        {/each}
        <BalanceSummarySection titleKey="totalBalance" amount={Number(walletBalance?.baseCoin?.total ?? 0)} bold />
    </div>
    <Button onClick={onConsolidationClick}>
        {localize('popups.balanceBreakdown.minimizeStorageDepositButton')}
    </Button>
</div>
