<script lang="typescript">
    import { tick } from 'svelte'
    import { get } from 'svelte/store'
    import { Button, Icon, Spinner, Text, Tooltip } from 'shared/components'
    import { localize } from 'shared/lib/i18n'
    import { hasNodePlugin, networkStatus } from 'shared/lib/networkStatus'
    import { NodePlugin } from 'shared/lib/typings/node'
    import { showAppNotification } from 'shared/lib/notifications'
    import { openPopup, popupState } from 'shared/lib/popup'
    import { formatUnitBestMatch } from 'shared/lib/units'
    import { wallet } from 'shared/lib/wallet'

    import { canAccountParticipate } from 'shared/lib/participation'
    import {
        accountToParticipate,
        partiallyStakedAccounts,
        partiallyStakedAmount,
        participationAction,
        participationOverview,
        stakedAccounts,
        stakedAmount,
        stakingEventState,
        unstakedAmount,
    } from 'shared/lib/participation/stores'
    import { ParticipationAction, ParticipationEventState} from 'shared/lib/participation/types'

    $: $participationOverview, $stakedAccounts, $partiallyStakedAccounts

    let showSpinner
    $: showSpinner = !$popupState.active && $participationAction && $accountToParticipate

    let canStakeAnAccount
    $: canStakeAnAccount = get($wallet.accounts).filter((wa) => canAccountParticipate(wa)).length > 0

    let stakingHasEnded
    $: stakingHasEnded = $stakingEventState === ParticipationEventState.Ended

    let isStaked
    $: isStaked = $stakedAmount > 0 && !stakingHasEnded

    let isPartiallyStaked
    $: isPartiallyStaked = $partiallyStakedAccounts.length > 0 && !stakingHasEnded

    const NUM_CHANCES = 1000
    const LUCKY_NUM = 3
    const showSteak = Math.floor(Math.random() * NUM_CHANCES) + 1 === LUCKY_NUM

    let canParticipateWithNode = false
    $: $networkStatus, canParticipateWithNode = hasNodePlugin(NodePlugin.Participation)

    let showTooltip = false
    $: {
        if (!isPartiallyStaked)
            showTooltip = false
    }

    let iconBox
    let parentWidth = 0
    let parentLeft = 0
    let parentTop = 0

    $: iconBox, showTooltip, void refreshIconBox()

    const refreshIconBox = async (): Promise<void> => {
        if (!iconBox || !showTooltip) return

        await tick()

        parentWidth = iconBox?.offsetWidth / 2 ?? 0
        parentLeft = iconBox?.getBoundingClientRect().left ?? 0

        /**
         * CAUTION: The top requires a specific multiplier that
         * does seem to play nicely with responsiveness.
         */
        const top = iconBox?.getBoundingClientRect().top ?? 0
        const topMultiplier = isPartiallyStaked ? 1.6 : -10000
        parentTop = top * topMultiplier
    }

    const toggleTooltip = (): void => {
        showTooltip = !showTooltip
    }

    const handleStakeFundsClick = (): void => {
        if (!canStakeAnAccount) {
            showAppNotification({
                type: 'warning',
                message: localize('warning.participation.noAccounts'),
            })

            return
        }

        const showNotice = $stakingEventState === ParticipationEventState.Upcoming || $stakingEventState === ParticipationEventState.Commencing
        const type = !isStaked && showNotice ? 'stakingNotice' : 'stakingManager'

        openPopup({ type, hideClose: false })
    }
</script>

<div class="p-5 flex flex-col justify-between space-y-6 w-full h-full">
    <div class="flex flex-col justify-between">
        <div class="flex flex-row justify-between items-start">
            <Text type="p" overrideColor classes="mb-2 text-gray-700 text-13 font-normal dark:text-white">
                {localize('views.staking.summary.stakedFunds')}
            </Text>
            {#if isPartiallyStaked}
                <div
                    bind:this={iconBox}
                    on:mouseenter={toggleTooltip}
                    on:mouseleave={toggleTooltip}
                >
                    {#if isPartiallyStaked}
                        <Icon icon="exclamation" classes="fill-current text-yellow-600" />
                    {/if}
                </div>
            {/if}
        </div>
        <Text type="h5" classes="text-3xl">{formatUnitBestMatch(stakingHasEnded ? 0 : $stakedAmount)}</Text>
        {#if !stakingHasEnded} 
            <Text type="p" smaller overrideColor classes="mt-1 text-gray-500 dark:text-gray-600">
                {formatUnitBestMatch($unstakedAmount)}
                {localize('general.unstaked')}
            </Text>
        {/if}
    </div>
    <Button
        classes="w-full text-14"
        disabled={showSpinner || stakingHasEnded}
        caution={isStaked && isPartiallyStaked}
        secondary={isStaked && !isPartiallyStaked}
        onClick={() => canParticipateWithNode ? handleStakeFundsClick() : showAppNotification({ type: 'warning', message: localize('error.node.pluginNotAvailable', { values: { nodePlugin: NodePlugin.Participation } }) })}
    >
        {#if showSpinner}
            <Spinner
                busy
                message={localize(`general.${$participationAction === ParticipationAction.Stake ? 'staking' : 'unstaking'}`)}
                classes="mx-2 justify-center"
            />
        {:else}
            {localize(`actions.${isStaked ? 'manageStake' : showSteak ? 'gimmeSteak' : 'stakeFunds'}`)}
        {/if}
    </Button>
</div>
{#if showTooltip}
    <Tooltip {parentTop} {parentLeft} {parentWidth} position="right">
        {#if isPartiallyStaked}
            <Text type="p" classes="text-gray-900 bold mb-1 text-left">
                {localize(
                    `tooltips.partiallyStakedFunds.title${$partiallyStakedAmount !== undefined ? '' : 'NoFunds'}`,
                    $partiallyStakedAmount !== undefined
                        ? { values: { amount: formatUnitBestMatch($partiallyStakedAmount) } }
                        : { }
                )}
            </Text>
            <Text type="p" secondary classes="text-left">
                {localize('tooltips.partiallyStakedFunds.preBody')}
                {localize('tooltips.partiallyStakedFunds.body')}
            </Text>
        {/if}
    </Tooltip>
{/if}
