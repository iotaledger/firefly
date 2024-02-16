<script lang="ts">
    import { closePopup, openPopup, PopupId } from '@auxiliary/popup'
    import { isVestingOutputId, selectedWalletVestingOverview } from '@contexts/vesting'
    import { selectedWallet } from '@core/wallet'
    import { localize } from '@core/i18n'
    import { checkActiveProfileAuth } from '@core/profile'
    import { getManaBalance } from '@core/network'
    import { consolidateOutputs } from '@core/wallet/actions/consolidateOutputs'
    import { getStorageDepositFromOutput } from '@core/wallet/utils/generateActivity/helper'
    import { UnlockCondition, UnlockConditionType, CommonOutput } from '@iota/sdk/out/types'
    import { BalanceSummarySection, Button, FontWeight, Text, TextType } from '@ui'
    import { TextHintVariant } from '@ui/enums'
    import features from '@features/features'

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
        const totalBalanceWithoutBic = getManaBalance(walletBalance?.mana?.total)
        const availableBalance = getManaBalance(walletBalance?.mana?.available)
        const totalBalance = totalBalanceWithoutBic + walletBalance.blockIssuanceCredits

        const subBreakdown = {
            availableMana: { amount: availableBalance },
            lockedMana: { amount: totalBalanceWithoutBic - availableBalance },
            bicMana: { amount: walletBalance.blockIssuanceCredits },
        }
        return { amount: totalBalance, subBreakdown, isBaseToken: false }
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
        const governanceAmount = parseInt($selectedWallet?.votingPower, 10)
        const totalLockedAmount = governanceAmount

        const subBreakdown = {
            governance: { amount: governanceAmount },
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
                isBaseToken={breakdown[breakdownKey].isBaseToken}
            />
        {/each}
        <BalanceSummarySection titleKey="totalBalance" amount={Number(walletBalance?.baseCoin?.total ?? 0)} bold />
    </div>
    <Button onClick={onConsolidationClick}>
        {localize('popups.balanceBreakdown.minimizeStorageDepositButton')}
    </Button>
</div>
