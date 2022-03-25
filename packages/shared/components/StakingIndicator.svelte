<script lang="typescript">
    import { Icon, Text, Tooltip } from 'shared/components'
    import { localize } from 'shared/lib/i18n'
    import { stakedAccounts, stakingEventState } from 'shared/lib/participation/stores'
    import { ParticipationEventState } from 'shared/lib/participation/types'
    import { hasAccountReachedMinimumAirdrop } from '../lib/participation'

    $: indicatorIcon = getIndicatorIcon($stakingEventState, $stakedAccounts.length > 0)
    $: indicatorText = getLocalizedIndicatorText($stakingEventState, $stakedAccounts.length > 0)
    $: tooltipText = getLocalizedTooltipText($stakingEventState, $stakedAccounts.length > 0)

    let showTooltip = false
    let tooltipAnchor

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
                stateText = isStaked ? 'holdingActive' : 'holdingInactive'
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
        _: ParticipationEventState,
        isStaked: boolean
    ): { title: string; body: string } => {
        const isHoldingPhase = $stakingEventState === ParticipationEventState.Holding
        const stateText: string = isHoldingPhase ? (isStaked ? 'active' : 'inactive') : $stakingEventState

        const localePath = `${stateText}${isHoldingPhase ? 'Holding' : ''}`
        return {
            title: localize(`tooltips.stakingIndicator.${localePath}.title`),
            body: localize(
                `tooltips.stakingIndicator.${localePath}.body${
                    localePath === 'ended' ? (hasAccountReachedMinimumAirdrop() ? 'Above' : 'Below') + 'RewardMin' : ''
                }`
            ),
        }
    }
</script>

<div
    class="pl-4 pr-3 py-2 flex flex-row space-x-2 items-center rounded-2xl bg-blue-100 dark:bg-gray-800"
    on:mouseenter={toggleTooltip}
    on:mouseleave={toggleTooltip}
    bind:this={tooltipAnchor}
>
    <div class="mr-1">
        <Icon icon="info-filled" width="16" height="16" classes="text-gray-600" />
    </div>
    <Text type="p">{indicatorText}</Text>
    <Icon icon={indicatorIcon} width="24" height="24" classes="text-blue-500" />
</div>
{#if showTooltip}
    <Tooltip anchor={tooltipAnchor} position="bottom" inlineStyle="max-width: 200px;">
        <Text type="p" classes="text-gray-900 bold mb-1 text-left">{tooltipText?.title}</Text>
        <Text type="p" secondary classes="text-left">{tooltipText?.body}</Text>
    </Tooltip>
{/if}
