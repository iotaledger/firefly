<script lang="typescript">
    import { onMount } from 'svelte'
    import { Button, Icon, Spinner, Text, TextHint, Tooltip } from 'shared/components'
    import { convertToFiat, currencies, exchangeRates, formatCurrency } from 'shared/lib/currency'
    import { promptUserToConnectLedger } from 'shared/lib/ledger'
    import { hasNodePlugin, networkStatus } from 'shared/lib/networkStatus'
    import { showAppNotification } from 'shared/lib/notifications'
    import {
        canParticipate,
        getAccountParticipationAbility,
        getStakedFunds,
        getUnstakedFunds,
        isAccountStaked,
        getIotasUntilMinimumAirdropReward,
    } from 'shared/lib/participation'
    import { participate, stopParticipating } from 'shared/lib/participation/api'
    import { STAKING_EVENT_IDS } from 'shared/lib/participation/constants'
    import {
        isPerformingParticipation,
        participationAction,
        assemblyStakingEventState,
        shimmerStakingEventState,
        resetPerformingParticipation,
    } from 'shared/lib/participation/stores'
    import { isPartiallyStaked, currentAccountTreasuryVoteValue } from 'shared/lib/participation/account'
    import {
        AccountParticipationAbility,
        Participation,
        ParticipationAction,
        StakingAirdrop,
    } from 'shared/lib/participation/types'
    import { openPopup, popupState } from 'shared/lib/popup'
    import { activeProfile, isSoftwareProfile } from 'shared/lib/profile'
    import { checkStronghold } from 'shared/lib/stronghold'
    import { AvailableExchangeRates, CurrencyTypes } from 'shared/lib/typings/currency'
    import { NodePlugin } from 'shared/lib/typings/node'
    import { WalletAccount } from 'shared/lib/typings/wallet'
    import { formatUnitBestMatch } from 'shared/lib/units'
    import { selectedAccountStore } from 'shared/lib/wallet'
    import { localize } from '@core/i18n'

    export let shouldParticipateOnMount = false
    export let participations: Participation[] = []

    $: participationAbility = getAccountParticipationAbility($selectedAccountStore)
    $: canStake = canParticipate($assemblyStakingEventState) || canParticipate($shimmerStakingEventState)

    $: isCurrentAccountStaked = isAccountStaked($selectedAccountStore?.id)

    function displayErrorNotification(error): void {
        showAppNotification({
            type: 'error',
            message: localize(error.error),
        })
    }

    function getFormattedFiatAmount(amount: number): string {
        const currency = $activeProfile?.settings.currency ?? AvailableExchangeRates.USD
        return formatCurrency(
            convertToFiat(amount, $currencies?.[CurrencyTypes.USD], $exchangeRates?.[currency]),
            currency
        )
    }

    async function handleParticipationAction(): Promise<void> {
        if (!canStake || !$participationAction) {
            return
        }

        isPerformingParticipation.set(true)

        const hasParticipationPlugin = $networkStatus.nodePlugins.includes(NodePlugin.Participation)
        if (!hasParticipationPlugin) {
            showAppNotification({
                type: 'error',
                message: localize('error.node.pluginNotAvailable', {
                    values: { nodePlugin: NodePlugin.Participation },
                }),
            })

            resetPerformingParticipation()

            return
        }

        switch ($participationAction) {
            case ParticipationAction.Stake: {
                await participate($selectedAccountStore?.id, participations, $participationAction).catch((err) => {
                    console.error(err)

                    displayErrorNotification(err)
                    resetPerformingParticipation()
                })
                break
            }
            case ParticipationAction.Unstake:
                await stopParticipating($selectedAccountStore?.id, STAKING_EVENT_IDS, $participationAction).catch(
                    (err) => {
                        console.error(err)

                        displayErrorNotification(err)
                        resetPerformingParticipation()
                    }
                )
                break
            default:
                break
        }
    }

    function handleStakeClick(): void {
        const openStakingConfirmationPopup = () =>
            openPopup(
                {
                    type: 'stakingConfirmation',
                },
                true
            )
        if ($isSoftwareProfile) {
            openStakingConfirmationPopup()
        } else {
            promptUserToConnectLedger(false, () => openStakingConfirmationPopup(), undefined, true)
        }
    }

    function handleUnstakeClick(): void {
        const _unstake = () => {
            $participationAction = ParticipationAction.Unstake

            if ($popupState.type !== 'stakingManager') {
                openPopup({
                    type: 'stakingManager',
                    props: {
                        shouldParticipateOnMount: true,
                    },
                })
            } else {
                void handleParticipationAction()
            }
        }

        if ($isSoftwareProfile) {
            checkStronghold(_unstake)
        } else {
            promptUserToConnectLedger(false, () => _unstake(), undefined, true)
        }
    }

    onMount(async () => {
        if (!hasNodePlugin(NodePlugin.Participation)) {
            showAppNotification({
                type: 'warning',
                message: localize('error.node.pluginNotAvailable', {
                    values: { nodePlugin: NodePlugin.Participation },
                }),
            })

            resetPerformingParticipation()

            return
        }

        /**
         * NOTE: Because of Stronghold and Ledger prompts to "unlock"
         * the wallets, this popup MAY BE instantiated with an "accountToAction",
         * which is the particular account the user chose to either stake or unstake.
         * We can safely assume here that there are no more confirmations to approve,
         * so we will perform the action (of either staking or unstaking).
         */
        if (shouldParticipateOnMount) {
            await handleParticipationAction()
        }
    })

    let showTooltip = false
    let tooltipAnchor: unknown
    const tooltipAnchors: { [accountIndex: number]: unknown } = {}
    let tooltipMinBalance: string = ''

    function toggleTooltip(account: WalletAccount): void {
        showTooltip = !showTooltip

        if (showTooltip) {
            tooltipAnchor = tooltipAnchors[account?.index]
            // Check for Assembly only because it has lower reward requirements
            tooltipMinBalance = getIotasUntilMinimumAirdropReward(account, StakingAirdrop.Assembly, true)
        } else {
            tooltipAnchor = undefined
            tooltipMinBalance = ''
        }
    }
</script>

<Text type="h4" classes="mb-2">{localize('popups.stakingManager.title')}</Text>
<Text type="p" secondary classes="mb-4">{localize('popups.stakingManager.description')}</Text>

{#if $currentAccountTreasuryVoteValue}
    <TextHint
        classes="p-4 rounded-2xl bg-blue-50 dark:bg-gray-800 mb-6"
        icon="info"
        iconClasses="fill-current text-blue-500 dark:text-blue-500"
        hint={localize('popups.stakingManager.mergeStakeDisclaimerVoting')}
        hintClasses="text-gray-500 dark:text-gray-500"
    />
{/if}

<div class="staking flex flex-col mb-4">
    {#if participationAbility !== AccountParticipationAbility.HasDustAmount}
        <div
            class={`w-full flex flex-col rounded-xl border-2 border-solid
                ${
                    $isPartiallyStaked && !$isPerformingParticipation
                        ? 'border-yellow-600'
                        : 'border-gray-200 dark:border-gray-600'
                }`}
        >
            <div class="w-full space-x-4 px-5 py-3 flex flex-row justify-between items-center">
                {#if isCurrentAccountStaked}
                    <div class="bg-green-500 rounded-2xl">
                        <Icon icon="success-check" width="18" height="18" classes="text-white" />
                    </div>
                {:else if participationAbility === AccountParticipationAbility.WillNotReachMinAirdrop}
                    <div
                        bind:this={tooltipAnchors[$selectedAccountStore?.index]}
                        on:mouseenter={() => toggleTooltip($selectedAccountStore)}
                        on:mouseleave={() => toggleTooltip($selectedAccountStore)}
                    >
                        <Icon icon="exclamation" width="20" height="20" classes="text-orange-500" />
                    </div>
                {:else}
                    <Icon
                        icon="unlock"
                        width="24"
                        height="24"
                        classes={$isPerformingParticipation ||
                        participationAbility === AccountParticipationAbility.HasPendingTransaction
                            ? 'text-gray-400'
                            : 'text-gray-800 dark:text-white'}
                    />
                {/if}
                <div class="flex flex-col w-3/4">
                    <Text
                        type="p"
                        classes="font-extrabold"
                        disabled={$isPerformingParticipation ||
                            participationAbility === AccountParticipationAbility.HasPendingTransaction}
                    >
                        {$selectedAccountStore.alias}
                    </Text>
                    {#if $isPartiallyStaked}
                        <Text
                            type="p"
                            secondary
                            disabled={$isPerformingParticipation ||
                                participationAbility === AccountParticipationAbility.HasPendingTransaction}
                            classes="font-extrabold"
                        >
                            {$isPartiallyStaked ? formatUnitBestMatch(getStakedFunds()) : $selectedAccountStore.balance}
                            •
                            <Text
                                type="p"
                                secondary
                                disabled={$isPerformingParticipation ||
                                    participationAbility === AccountParticipationAbility.HasPendingTransaction}
                                classes="inline"
                            >
                                {$isPartiallyStaked
                                    ? getFormattedFiatAmount(getStakedFunds())
                                    : $selectedAccountStore.balanceEquiv}
                            </Text>
                        </Text>
                    {:else}
                        <Text
                            type="p"
                            secondary
                            disabled={$isPerformingParticipation ||
                                participationAbility === AccountParticipationAbility.HasPendingTransaction}
                            classes="font-extrabold"
                        >
                            {$selectedAccountStore.balance}
                            •
                            <Text
                                type="p"
                                secondary
                                disabled={$isPerformingParticipation ||
                                    participationAbility === AccountParticipationAbility.HasPendingTransaction}
                                classes="inline"
                            >
                                {$selectedAccountStore.balanceEquiv}
                            </Text>
                        </Text>
                    {/if}
                </div>
                <Button
                    disabled={$isPerformingParticipation ||
                        participationAbility === AccountParticipationAbility.HasPendingTransaction}
                    secondary={isCurrentAccountStaked}
                    onClick={() => (isCurrentAccountStaked ? handleUnstakeClick() : handleStakeClick())}
                >
                    {#if $participationAction}
                        <Spinner busy={$isPerformingParticipation} classes="mx-2 justify-center" />
                    {:else if participationAbility === AccountParticipationAbility.HasPendingTransaction}
                        {localize('general.syncing')}
                    {:else}{localize(`actions.${isCurrentAccountStaked ? 'unstake' : 'stake'}`)}{/if}
                </Button>
            </div>
            {#if $isPartiallyStaked && !$isPerformingParticipation && participationAbility !== AccountParticipationAbility.WillNotReachMinAirdrop}
                <div
                    class="space-x-4 mx-2 mb-2 pl-4 pr-2.5 py-3 flex flex-row justify-between items-center rounded-lg border-2 border-solid border-gray-200 dark:border-gray-600"
                >
                    <Icon icon="exclamation" width="20" height="20" classes="fill-current text-yellow-600" />
                    <div class="flex flex-col w-3/4">
                        <Text type="p" classes="font-extrabold">{localize('general.unstakedFunds')}</Text>
                        <Text type="p" secondary classes="font-extrabold">
                            {formatUnitBestMatch(getUnstakedFunds())}
                            •
                            <Text type="p" secondary classes="inline">
                                {getFormattedFiatAmount(getUnstakedFunds())}
                            </Text>
                        </Text>
                    </div>
                    <Button
                        caution={$isPartiallyStaked}
                        disabled={$isPerformingParticipation ||
                            participationAbility === AccountParticipationAbility.HasPendingTransaction}
                        onClick={() => handleStakeClick()}
                    >
                        {localize('actions.merge')}
                    </Button>
                </div>
            {/if}
        </div>
    {/if}
</div>

{#if showTooltip}
    <Tooltip anchor={tooltipAnchor} position="right">
        <Text type="h3" classes="text-left">
            {localize('tooltips.stakingMinRewards.titleMinBalance', { values: { amount: tooltipMinBalance } })}
        </Text>
        <Text type="p" secondary classes="text-left">{localize('tooltips.stakingMinRewards.bodyMinBalance')}</Text>
    </Tooltip>
{/if}

<style>
    .staking {
        max-height: 36vh;
    }
</style>
