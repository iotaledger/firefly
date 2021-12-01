<script lang="typescript">
    import { Button, Icon, Spinner, Text, Tooltip } from 'shared/components'
    import { localize } from 'shared/lib/i18n'
    import {
        canParticipate,
        accountToParticipate,
        partiallyStakedAccounts,
        partiallyStakedAmount,
        participationAction,
        participationOverview,
        stakedAccounts,
        stakedAmount,
        stakingEventState,
        unstakedAmount,
    } from 'shared/lib/participation'
    import { openPopup, popupState } from 'shared/lib/popup'
    import { ParticipationAction, ParticipationEventState } from 'shared/lib/typings/participation'
    import { formatUnitBestMatch } from 'shared/lib/units'
    import { tick } from 'svelte'

    $: participationOverview, $stakedAccounts, $partiallyStakedAccounts

    let canStake

    $: canStake = canParticipate($stakingEventState)
    let isStaked

    $: isStaked = $stakedAmount > 0
    let isPartiallyStaked

    $: isPartiallyStaked = $partiallyStakedAccounts.length > 0
    $: showSpinner = !$popupState.active && $participationAction && $accountToParticipate

    let showTooltip = false
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
        parentTop = top * 1.6
    }

    const toggleTooltip = (): void => {
        showTooltip = !showTooltip
    }

    const handleStakeFundsClick = () => {
        const isUpcoming = $stakingEventState === ParticipationEventState.Upcoming
        const type = !isStaked && isUpcoming ? 'stakingNotice' : 'stakingManager'

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
                    <Icon icon="exclamation" classes="fill-current text-yellow-600" />
                </div>
            {/if}
        </div>
        <Text type="h5" classes="text-3xl">{formatUnitBestMatch($stakedAmount)}</Text>
        <Text type="p" smaller overrideColor classes="mt-1 text-gray-500 dark:text-gray-600">
            {formatUnitBestMatch($unstakedAmount)}
            {localize('general.unstaked')}
        </Text>
    </div>
    <Button
        classes="w-full text-14"
        disabled={!canStake || showSpinner}
        caution={isStaked && isPartiallyStaked}
        secondary={isStaked && !isPartiallyStaked}
        onClick={handleStakeFundsClick}
    >
        {#if showSpinner}
            <Spinner
                busy
                message={localize(`general.${$participationAction === ParticipationAction.Stake ? 'staking' : 'unstaking'}`)}
                classes="mx-2 justify-center"
            />
        {:else}
            {localize(`actions.${isStaked ? 'manageStake' : 'stakeFunds'}`)}
        {/if}
    </Button>
</div>
{#if showTooltip}
    <Tooltip {parentTop} {parentLeft} {parentWidth} position="right">
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
    </Tooltip>
{/if}
