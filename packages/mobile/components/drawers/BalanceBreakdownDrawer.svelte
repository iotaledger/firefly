<script lang="ts">
    import { UnlockConditionType, UnlockCondition, OutputType, CommonOutput } from '@iota/wallet'
    import { BalanceSummarySection, Button } from '@ui'

    import { selectedAccount } from '@core/account'
    import { localize } from '@core/i18n'
    import { isStrongholdUnlocked } from '@core/profile-manager'
    import { consolidateOutputs } from '@core/wallet/actions/consolidateOutputs'
    import { getStorageDepositFromOutput } from '@core/wallet/utils/generateActivity/helper'

    import { closeDrawer, DrawerId, openDrawer } from '@/auxiliary/drawer'

    interface Breakdown {
        amount: number
        subBreakdown?: { [key: string]: { amount: number } }
    }

    enum PendingFundsType {
        Unclaimed = 'unclaimed',
        StorageDepositReturn = 'storageDepositReturn',
        Timelock = 'timelock',
    }

    $: accountBalance = $selectedAccount?.balances

    let breakdown: { [key: string]: Breakdown } = {}
    $: accountBalance, void setBreakdown()
    async function setBreakdown(): Promise<void> {
        const availableBreakdown = getAvailableBreakdown()
        const pendingBreakdown = await getPendingBreakdown()
        const lockedBreakdown = getLockedBreakdown()
        const storageDepositBreakdown = getStorageDepositBreakdown()

        breakdown = {
            available: availableBreakdown,
            pending: pendingBreakdown,
            locked: lockedBreakdown,
            storageDeposit: storageDepositBreakdown,
        }
    }

    function getAvailableBreakdown(): Breakdown {
        return { amount: Number(accountBalance?.baseCoin?.available ?? 0) }
    }

    async function getPendingBreakdown(): Promise<Breakdown> {
        let pendingOutputsStorageDeposit = 0

        const subBreakdown = {}
        for (const [outputId, unlocked] of Object.entries(accountBalance?.potentiallyLockedOutputs ?? {})) {
            if (!unlocked) {
                const output = (await $selectedAccount.getOutput(outputId)).output

                let type: string
                let amount: number
                if (output.getType() !== OutputType.Treasury) {
                    const commonOutput = output as CommonOutput
                    if (containsUnlockCondition(commonOutput.getUnlockConditions(), UnlockConditionType.Expiration)) {
                        type = PendingFundsType.Unclaimed
                        amount = Number(commonOutput.getAmount())
                    } else if (
                        containsUnlockCondition(
                            commonOutput.getUnlockConditions(),
                            UnlockConditionType.StorageDepositReturn
                        )
                    ) {
                        type = PendingFundsType.StorageDepositReturn
                        // TODO-sdk the signature of this function has changed recently. Find a way to fix
                        amount = getStorageDepositFromOutput(commonOutput).storageDeposit
                    } else if (
                        containsUnlockCondition(commonOutput.getUnlockConditions(), UnlockConditionType.Timelock)
                    ) {
                        type = PendingFundsType.Timelock
                        amount = Number(output.getAmount())
                    }
                }

                if (!subBreakdown[type]) {
                    subBreakdown[type] = amount
                } else {
                    subBreakdown[type] += amount
                }
                pendingOutputsStorageDeposit += amount
            }
        }

        return { amount: pendingOutputsStorageDeposit, subBreakdown }
    }

    function getLockedBreakdown(): Breakdown {
        const governanceAmount = parseInt($selectedAccount?.votingPower, 10)
        const totalLockedAmount = governanceAmount

        const subBreakdown = {
            governance: { amount: governanceAmount },
        }

        return { amount: totalLockedAmount, subBreakdown }
    }

    function getStorageDepositBreakdown(): Breakdown {
        const storageDeposits = accountBalance?.requiredStorageDeposit
        const totalStorageDeposit = storageDeposits
            ? Object.values(accountBalance.requiredStorageDeposit).reduce(
                  (total: number, value: string): number => total + Number(value ?? 0),
                  0
              )
            : 0

        const subBreakdown = {
            basicOutputs: { amount: Number(storageDeposits?.basic ?? 0) },
            nftOutputs: { amount: Number(storageDeposits?.nft ?? 0) },
            aliasOutputs: { amount: Number(storageDeposits?.alias ?? 0) },
            foundryOutputs: { amount: Number(storageDeposits?.foundry ?? 0) },
        }

        return { amount: totalStorageDeposit, subBreakdown }
    }

    function containsUnlockCondition(unlockConditions: UnlockCondition[], unlockConditionId: number): boolean {
        return unlockConditions.some((unlockCondition) => unlockCondition.getType() === unlockConditionId)
    }

    function onConsolidationClick(): void {
        const _onConfirm = async (): Promise<void> => {
            const isUnlocked = await isStrongholdUnlocked()
            if (isUnlocked) {
                await consolidateOutputs()
                closeDrawer(DrawerId.Confirm)
            } else {
                openDrawer(DrawerId.EnterPassword, { onSuccess: _onConfirm })
            }
        }

        openDrawer(DrawerId.Confirm, {
            title: localize('popups.minimizeStorageDeposit.title'),
            description: localize('popups.minimizeStorageDeposit.description'),
            hint: localize('popups.minimizeStorageDeposit.confirmButton'),
            info: true,
            onConfirm: _onConfirm,
        })
    }
</script>

<div class="w-full h-full space-y-6 flex flex-auto flex-col shrink-0">
    <div class="flex flex-col space-y-8">
        {#each Object.keys(breakdown) as breakdownKey}
            <BalanceSummarySection
                titleKey={breakdownKey}
                subtitleKey={breakdownKey}
                amount={breakdown[breakdownKey].amount}
                subBreakdown={breakdown[breakdownKey].subBreakdown}
            />
        {/each}
        <BalanceSummarySection titleKey="totalBalance" amount={Number(accountBalance?.baseCoin?.total ?? 0)} bold />
    </div>
    <Button onClick={onConsolidationClick}>
        {localize('popups.balanceBreakdown.minimizeStorageDepositButton')}
    </Button>
</div>
