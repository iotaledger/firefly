<script lang="typescript">
    import { tick } from 'svelte'
    import { Icon, Text, Tooltip } from 'shared/components'
    import { localize } from 'shared/lib/i18n'
    import { participationOverview, stakedAccounts, stakingEventState } from 'shared/lib/participation/stores'
    import { ParticipationEventState } from 'shared/lib/participation/types'

    let accountOverviewBelowMinimum
    $: accountOverviewBelowMinimum = $participationOverview.find((apo) => apo.participations.length > 0 && (apo.assemblyRewardsBelowMinimum > 0 || apo.shimmerRewardsBelowMinimum > 0)) !== undefined

    let isBelowMinimumStakingRewards
    $: isBelowMinimumStakingRewards = accountOverviewBelowMinimum &&
        $stakingEventState === ParticipationEventState.Holding &&
        $stakedAccounts.length > 0

    let indicatorIcon
    $: indicatorIcon = getIndicatorIcon($stakingEventState, $stakedAccounts.length > 0)

    let indicatorText
    $: indicatorText = getLocalizedIndicatorText($stakingEventState, $stakedAccounts.length > 0)

    let tooltipText
    $: tooltipText = getLocalizedTooltipText($stakingEventState, $stakedAccounts.length > 0)

    let showTooltip = false
    let indicatorBox
    let parentWidth = 0
    let parentLeft = 0
    let parentTop = 0

    $: indicatorBox, showTooltip, void refreshIndicatorBox()

    async function refreshIndicatorBox() {
        if (!indicatorBox || !showTooltip) {
            return
        }
        await tick()
        parentWidth = indicatorBox?.offsetWidth / 2
        parentLeft = indicatorBox?.getBoundingClientRect().left ?? 0
        parentTop = indicatorBox?.getBoundingClientRect().top ?? 0
    }

    const toggleTooltip = (): void => {
        showTooltip = !showTooltip
    }

    const getIndicatorIcon = (state: ParticipationEventState, isStaked: boolean): string => {
        if (!isStaked) return 'unlock'

        switch (state) {
            case ParticipationEventState.Upcoming:
                return 'unlock'
            case ParticipationEventState.Commencing:
                return 'timer'
            case ParticipationEventState.Holding:
                return 'lock'
            case ParticipationEventState.Ended:
            default:
                return 'unlock'
        }
    }

    const getLocalizedIndicatorText = (state: ParticipationEventState, isStaked: boolean): string => {
        let stateText: string
        switch (state) {
            case ParticipationEventState.Upcoming:
                stateText = 'upcoming'
                break
            case ParticipationEventState.Commencing:
                stateText = 'commencing'
                break
            case ParticipationEventState.Holding:
                stateText = isStaked ? isBelowMinimumStakingRewards ? 'minRewards' : 'active' : 'inactive'
                break
            case ParticipationEventState.Ended:
                stateText = 'ended'
                break
            case ParticipationEventState.Inactive:
            default:
                stateText = 'inactive'
                break
        }

        return localize(`views.staking.status.${stateText}`)
    }

    const getLocalizedTooltipText = (
        state: ParticipationEventState,
        isStaked: boolean
    ): { title: string; body: string } => {
        const isHoldingPhase = $stakingEventState === ParticipationEventState.Holding
        const stateText: string = isHoldingPhase
            ? isStaked ? 'active' : 'inactive'
            : $stakingEventState

        const localePath = isBelowMinimumStakingRewards ? 'minRewards' : `${stateText}${isHoldingPhase ? 'Holding' : ''}`
        return {
            title: localize(`tooltips.stakingIndicator.${localePath}.title`),
            body: localize(`tooltips.stakingIndicator.${localePath}.body`, isBelowMinimumStakingRewards ? { values: { duration: '0 days' } } : {}),
        }
    }
</script>

<div
    class="px-3 py-2 flex flex-row space-x-2 items-center rounded-2xl {isBelowMinimumStakingRewards ? 'bg-yellow-200' : 'bg-blue-100'} dark:bg-gray-800"
    on:mouseenter={toggleTooltip}
    on:mouseleave={toggleTooltip}
>
    <div bind:this={indicatorBox}>
        {#if isBelowMinimumStakingRewards}
            <Icon icon='exclamation' width="16" height="16" classes="text-gray-800 dark:text-white" />
        {:else}
            <Icon icon='info-filled' width="16" height="16" classes="text-gray-600" />
        {/if}
    </div>
    <Text type="p">{indicatorText}</Text>
    <Icon icon={indicatorIcon} width="24" height="24" classes="text-{isBelowMinimumStakingRewards ? 'yellow-700' : 'blue-500'}" />
</div>
{#if showTooltip}
    <Tooltip {parentTop} {parentLeft} {parentWidth} position="bottom">
        <Text type="p" classes="text-gray-900 bold mb-1 text-left">{tooltipText?.title}</Text>
        <Text type="p" secondary classes="text-left">{tooltipText?.body}</Text>
    </Tooltip>
{/if}
