<script lang="ts">
    import { closePopup, openPopup } from '@auxiliary/popup'
    import { selectedAccount } from '@core/account'
    import { localize } from '@core/i18n'
    import { checkActiveProfileAuth } from '@core/profile'
    import {
        OUTPUT_TYPE_TREASURY,
        UNLOCK_CONDITION_EXPIRATION,
        UNLOCK_CONDITION_STORAGE_DEPOSIT_RETURN,
        UNLOCK_CONDITION_TIMELOCK,
    } from '@core/wallet'
    import { consolidateOutputs } from '@core/wallet/actions/consolidateOutputs'
    import { getStorageDepositFromOutput } from '@core/wallet/utils/generateActivity/helper'
    import type { AccountBalance } from '@iota/wallet'
    import { BalanceSummarySection, Button, FontWeight, Text } from 'shared/components'

    let accountBalance: AccountBalance
    $: $selectedAccount, void getAccountBalance()
    async function getAccountBalance(): Promise<void> {
        accountBalance = await $selectedAccount.getBalance()
    }

    interface Breakdown {
        [key: string]: {
            amount: number
            subBreakdown?: { [key: string]: { amount: number } }
        }
    }

    let breakdown: Breakdown = {}
    $: accountBalance, setBreakdown()
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

    function getAvailableBreakdown(): { amount: number } {
        return { amount: Number(accountBalance?.baseCoin?.available ?? 0) }
    }

    async function getPendingBreakdown(): Promise<{ amount: number; subBreakdown: Breakdown }> {
        let pendingOutputsStorageDeposit = 0

        const subBreakdown = {}
        for (const [outputId, unlocked] of Object.entries(accountBalance?.potentiallyLockedOutputs ?? {})) {
            if (!unlocked) {
                const output = (await $selectedAccount.getOutput(outputId)).output

                let type: string
                let amount: number
                if (output.type !== OUTPUT_TYPE_TREASURY) {
                    if (
                        output.unlockConditions.some(
                            (unlockCondition) => unlockCondition.type === UNLOCK_CONDITION_EXPIRATION
                        )
                    ) {
                        type = 'unclaimed'
                        amount = Number(output.amount)
                    } else if (
                        output.unlockConditions.some(
                            (unlockCondition) => unlockCondition.type === UNLOCK_CONDITION_STORAGE_DEPOSIT_RETURN
                        )
                    ) {
                        type = 'storageDepositReturn'
                        amount = getStorageDepositFromOutput(output).storageDeposit
                    } else if (
                        output.unlockConditions.some(
                            (unlockCondition) => unlockCondition.type === UNLOCK_CONDITION_TIMELOCK
                        )
                    ) {
                        type = 'timelock'
                        amount = Number(output.amount)
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

    function getLockedBreakdown(): { amount: number; subBreakdown: Breakdown } {
        const governanceAmount = parseInt($selectedAccount?.votingPower, 10)
        const stakingAmount = parseInt($selectedAccount?.votingPower, 10) // TODO:

        const totalLockedAmount = governanceAmount + stakingAmount

        const subBreakdown = {
            governance: { amount: governanceAmount },
        }

        return { amount: totalLockedAmount, subBreakdown }
    }

    function getStorageDepositBreakdown(): { amount: number; subBreakdown: Breakdown } {
        const totalStorageDeposit = accountBalance?.requiredStorageDeposit
            ? Object.values(accountBalance.requiredStorageDeposit).reduce(
                  (total: number, value: string): number => total + Number(value),
                  0
              )
            : 0

        const subBreakdown = {
            basicOutputs: { amount: Number(accountBalance?.requiredStorageDeposit?.basic ?? 0) },
            nftOutputs: { amount: Number(accountBalance?.requiredStorageDeposit?.nft ?? 0) },
            aliasOutputs: { amount: Number(accountBalance?.requiredStorageDeposit?.alias ?? 0) },
            foundryOutputs: { amount: Number(accountBalance?.requiredStorageDeposit?.foundry ?? 0) },
        }

        return { amount: totalStorageDeposit, subBreakdown }
    }

    function handleConsolidation(): void {
        openPopup({
            type: 'confirmation',
            props: {
                title: localize('popups.minimizeStorageDeposit.title'),
                description: localize('popups.minimizeStorageDeposit.description'),
                confirmText: localize('popups.minimizeStorageDeposit.confirmButton'),
                info: true,
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
    <Text type="h3" fontWeight={FontWeight.semibold} lineHeight="6">
        {localize('popups.balanceBreakdown.title')}
    </Text>
    <div class="flex flex-col space-y-8">
        {#each Object.keys(breakdown) as breakdownKey}
            <BalanceSummarySection
                key={breakdownKey}
                amount={breakdown[breakdownKey].amount}
                subBreakdown={breakdown[breakdownKey].subBreakdown}
            />
        {/each}
    </div>
    <Button onClick={handleConsolidation}>
        {localize('popups.balanceBreakdown.minimizeStorageDepositButton')}
    </Button>
</div>
