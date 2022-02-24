<script lang="typescript">
    import { Button, Icon, Spinner, Text, Tooltip } from 'shared/components'
    import { localize } from 'shared/lib/i18n'
    import { hasNodePlugin, networkStatus } from 'shared/lib/networkStatus'
    import { showAppNotification } from 'shared/lib/notifications'
    import { getAccountParticipationAbility, isStakingPossible } from 'shared/lib/participation'
    import {
        accountToParticipate,
        partiallyStakedAccounts,
        partiallyUnstakedAmount,
        participationAction,
        participationOverview,
        stakedAccounts,
        stakedAmount,
        stakingEventState,
        unstakedAmount,
    } from 'shared/lib/participation/stores'
    import {
        AccountParticipationAbility,
        ParticipationAction,
        ParticipationEventState,
    } from 'shared/lib/participation/types'
    import { openPopup, popupState } from 'shared/lib/popup'
    import { NodePlugin } from 'shared/lib/typings/node'
    import { formatUnitBestMatch } from 'shared/lib/units'
    import { isSyncing, selectedAccount, wallet } from 'shared/lib/wallet'

    const { accounts } = $wallet

    $: showSpinner = (!$popupState.active && $participationAction && $accountToParticipate) || $isSyncing

    $: canParticipateInEvent = isStakingPossible($stakingEventState)

    $: cannotStakeAnAccount = $accounts.every(
        (wa) => getAccountParticipationAbility(wa) === AccountParticipationAbility.HasDustAmount
    )

    $: isStaked = $stakedAmount > 0 && canParticipateInEvent

    $: isPartiallyStaked = $partiallyStakedAccounts.length > 0 && canParticipateInEvent

    let canParticipateWithNode = false
    $: $networkStatus, (canParticipateWithNode = hasNodePlugin(NodePlugin.Participation))

    let showTooltip = false
    $: {
        if (!isPartiallyStaked) showTooltip = false
    }

    let tooltipAnchor

    const toggleTooltip = (): void => {
        showTooltip = !showTooltip
    }

    const handleStakeFundsClick = (): void => {
        if (cannotStakeAnAccount) {
            showAppNotification({
                type: 'warning',
                message: localize('warning.participation.noAccounts'),
            })

            return
        }

        const showNotice =
            $stakingEventState === ParticipationEventState.Upcoming ||
            $stakingEventState === ParticipationEventState.Commencing
        const type = !isStaked && showNotice ? 'stakingNotice' : 'stakingManager'

        openPopup({ type, hideClose: false })
    }

    const getSpinnerMessage = (): string => {
        if ($participationAction) {
            return $participationAction === ParticipationAction.Stake ? 'general.staking' : 'general.unstaking'
        } else if ($isSyncing) {
            return 'general.syncingAccounts'
        }
    }
</script>

<div class="p-5 flex flex-col justify-between space-y-6 w-full h-full">
    <div class="flex flex-col justify-between">
        <div class="flex flex-row justify-between items-start">
            <Text type="p" smaller overrideColor classes="mb-3 text-gray-700 dark:text-gray-500">
                {localize('views.staking.summary.stakedFunds')}
            </Text>
            {#if isPartiallyStaked}
                <div bind:this={tooltipAnchor} on:mouseenter={toggleTooltip} on:mouseleave={toggleTooltip}>
                    <Icon icon="exclamation" classes="fill-current text-yellow-600" />
                </div>
            {/if}
        </div>
        <Text type="h2">{formatUnitBestMatch(canParticipateInEvent ? $stakedAmount : 0)}</Text>
        {#if canParticipateInEvent}
            <Text type="p" smaller secondary classes="mt-2">
                {formatUnitBestMatch($unstakedAmount)}
                {localize('general.unstaked')}
            </Text>
        {/if}
    </div>
    <Button
        classes="w-full text-14"
        disabled={showSpinner || !canParticipateInEvent}
        caution={isStaked && isPartiallyStaked}
        secondary={isStaked && !isPartiallyStaked}
        onClick={() =>
            canParticipateWithNode
                ? handleStakeFundsClick()
                : showAppNotification({
                      type: 'warning',
                      message: localize('error.node.pluginNotAvailable', {
                          values: { nodePlugin: NodePlugin.Participation },
                      }),
                  })}
    >
        {#if showSpinner}
            <Spinner busy message={localize(getSpinnerMessage())} classes="mx-2 justify-center" />
        {:else}{localize(`actions.${isStaked ? 'manageStake' : 'stakeFunds'}`)}{/if}
    </Button>
</div>
{#if showTooltip}
    <Tooltip anchor={tooltipAnchor} position="right">
        {#if isPartiallyStaked}
            <Text type="p" classes="text-gray-900 bold mb-1 text-left">
                {localize(
                    `tooltips.partiallyStakedFunds.title${$partiallyStakedAccounts.length > 0 ? '' : 'NoFunds'}`,
                    $partiallyStakedAccounts.length > 0
                        ? { values: { amount: formatUnitBestMatch($partiallyUnstakedAmount) } }
                        : {}
                )}
            </Text>
            <Text type="p" secondary classes="text-left">
                {localize('tooltips.partiallyStakedFunds.preBody')}
                {localize('tooltips.partiallyStakedFunds.body')}
            </Text>
        {/if}
    </Tooltip>
{/if}
