<script lang="typescript">
    import { localize } from '@core/i18n'
    import { Unit } from '@iota/unit-converter'
    import { Button, Icon, Spinner, Text, Tooltip } from 'shared/components'
    import { hasNodePlugin, networkStatus } from 'shared/lib/networkStatus'
    import { showAppNotification } from 'shared/lib/notifications'
    import {
        getAccountParticipationAbility,
        isNewStakingEvent,
        isParticipationPossible,
    } from 'shared/lib/participation'
    import {
        isPartiallyStaked,
        partiallyUnstakedAmount,
        stakedAmount,
        unstakedAmount,
    } from 'shared/lib/participation/account'
    import {
        assemblyStakingEventState,
        isChangingParticipation,
        shimmerStakingEventState,
    } from 'shared/lib/participation/stores'
    import { participationAction } from 'shared/lib/participation/stores'
    import { AccountParticipationAbility, ParticipationAction } from 'shared/lib/participation/types'
    import { openPopup } from 'shared/lib/popup'
    import { NodePlugin } from 'shared/lib/typings/node'
    import { formatUnitBestMatch, formatUnitPrecision } from 'shared/lib/units'
    import { isSyncing, selectedAccountStore } from 'shared/lib/wallet'

    $: showSpinner = !!$participationAction || $isSyncing || $isChangingParticipation

    $: canParticipateInEvent =
        isParticipationPossible($assemblyStakingEventState) || isParticipationPossible($shimmerStakingEventState)

    $: cannotStake = getAccountParticipationAbility($selectedAccountStore) === AccountParticipationAbility.HasDustAmount

    $: isStakedAndCanParticipate = $stakedAmount > 0 && canParticipateInEvent

    $: isPartiallyStakedAndCanParticipate = $isPartiallyStaked && canParticipateInEvent

    let spinnerMessage: string
    $: showSpinner, (spinnerMessage = getSpinnerMessage())

    let canParticipateWithNode = false
    $: $networkStatus, (canParticipateWithNode = hasNodePlugin(NodePlugin.Participation))

    let showTooltip = false
    // hide tooltip if tooltipAnchor destroys
    $: {
        if (!isPartiallyStakedAndCanParticipate) {
            showTooltip = false
        }
    }

    let tooltipAnchor
    function toggleTooltip(): void {
        showTooltip = !showTooltip
    }

    let showPreciseStakedAmount = false
    function togglePreciseStakedAmount() {
        showPreciseStakedAmount = !showPreciseStakedAmount
    }

    function handleStakeFundsClick(): void {
        if (cannotStake) {
            showAppNotification({
                type: 'warning',
                message: localize('warning.participation.noFunds'),
            })

            return
        }

        const showNotice = isNewStakingEvent($assemblyStakingEventState) || isNewStakingEvent($shimmerStakingEventState)

        const type = !isStakedAndCanParticipate && showNotice ? 'newStakingPeriodNotification' : 'stakingManager'

        openPopup({ type })
    }

    function getSpinnerMessage(): string {
        if ($isSyncing) {
            return localize('general.syncing')
        } else {
            switch ($participationAction) {
                case ParticipationAction.Stake:
                    return localize('general.staking')
                case ParticipationAction.Unstake:
                    return localize('general.unstaking')
                case ParticipationAction.Vote:
                    return localize('general.voting')
                case ParticipationAction.Unvote:
                    return localize('general.unvoting')
            }
        }
    }
</script>

<div class="p-6 flex flex-col justify-between w-full h-full relative">
    <div class="flex flex-row justify-between items-start">
        <Text type="p">{localize('views.staking.summary.stakedFunds')}</Text>
    </div>
    <div class="flex flex-col flex-wrap items-start mt-6">
        <div on:click={togglePreciseStakedAmount}>
            <h1 class="font-600 text-32 leading-120 text-gray-800 dark:text-white break-all">
                {showPreciseStakedAmount
                    ? formatUnitPrecision(canParticipateInEvent ? $stakedAmount : 0, Unit.Mi)
                    : formatUnitBestMatch(canParticipateInEvent ? $stakedAmount : 0, true, 3)}
            </h1>
        </div>
        {#if canParticipateInEvent}
            <Text type="p">{formatUnitBestMatch($unstakedAmount)} {localize('general.unstaked')}</Text>
        {/if}
    </div>
    <Button
        classes="w-full text-14 mt-6"
        disabled={showSpinner || !canParticipateInEvent}
        caution={isStakedAndCanParticipate && isPartiallyStakedAndCanParticipate}
        secondary={isStakedAndCanParticipate && !isPartiallyStakedAndCanParticipate}
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
            <Spinner busy message={spinnerMessage} classes="mx-2 justify-center" />
        {:else}{localize(`actions.${isStakedAndCanParticipate ? 'manageStake' : 'stakeFunds'}`)}{/if}
    </Button>
    {#if isPartiallyStakedAndCanParticipate}
        <div
            bind:this={tooltipAnchor}
            on:mouseenter={toggleTooltip}
            on:mouseleave={toggleTooltip}
            class="absolute top-6 right-6"
        >
            <Icon icon="exclamation" classes="fill-current text-yellow-600" />
        </div>
    {/if}
</div>
{#if showTooltip}
    <Tooltip anchor={tooltipAnchor} position="right">
        {#if isPartiallyStakedAndCanParticipate}
            <Text type="h3" classes="text-left">
                {localize(
                    `tooltips.partiallyStakedFunds.title${$isPartiallyStaked ? '' : 'NoFunds'}`,
                    $isPartiallyStaked ? { values: { amount: formatUnitBestMatch($partiallyUnstakedAmount) } } : {}
                )}
            </Text>
            <Text type="p" secondary classes="text-left">
                {localize('tooltips.partiallyStakedFunds.preBody')}
                {localize('tooltips.partiallyStakedFunds.body')}
            </Text>
        {/if}
    </Tooltip>
{/if}
