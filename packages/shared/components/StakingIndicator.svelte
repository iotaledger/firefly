<script lang="typescript">
    import { Icon, Text, Tooltip } from 'shared/components'
    import { localize } from 'shared/lib/i18n'
    import { tick } from 'svelte'
    import { stakedAccounts, stakingEventState } from '../lib/participation'
    import { ParticipationEventState } from '../lib/typings/participation'

    $: indicatorIcon = getIndicatorIcon($stakingEventState, $stakedAccounts.length > 0)
    $: indicatorText = getLocalizedIndicatorText($stakingEventState, $stakedAccounts.length > 0)
    $: tooltipText = getLocalizedTooltipText($stakingEventState, $stakedAccounts.length > 0)

    let showTooltip = false
    let indicatorBox
    let parentWidth = 0
    let parentLeft = 0
    let parentTop = 0

    $: indicatorBox, showTooltip, void refreshIndicatorBox()

    const refreshIndicatorBox = async (): Promise<void> => {
        if (!indicatorBox || !showTooltip) return

        await tick()

        parentWidth = indicatorBox?.offsetWidth / 2 ?? 0
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
            case ParticipationEventState.Commencing:
                stateText = isStaked ? 'commencing' : 'inactive'
            case ParticipationEventState.Holding:
                stateText = isStaked ? 'active' : 'inactive'
            case ParticipationEventState.Ended:
                stateText = 'ended'
            default:
                stateText = 'inactive'
        }
        return localize(`views.staking.status.${stateText}`)
    }

    const getLocalizedTooltipText = (
        state: ParticipationEventState,
        isStaked: boolean
    ): { title: string; body: string } => {
        // TODO: add tooltip text for each state
        let stateText: string = 'inactive'

        return {
            title: localize(`tooltips.staking.${stateText}.title`),
            body: localize(`tooltips.staking.${stateText}.body`),
        }
    }
</script>

<div
    class="px-3 py-2 flex flex-row justify-between items-center rounded-2xl bg-blue-100 dark:bg-gray-800"
    bind:this={indicatorBox}
    on:mouseenter={toggleTooltip}
    on:mouseleave={toggleTooltip}>
    <Icon icon={indicatorIcon} classes="fill-current text-blue-500" />
    <Text type="p" classes="mx-3">{indicatorText}</Text>
    <div>
        <Icon icon="info-filled" classes="fill-current text-gray-600 transform translate-y-1" />
    </div>
</div>
{#if showTooltip}
    <Tooltip {parentTop} {parentLeft} {parentWidth} position="right">
        <Text type="p" classes="text-gray-900 bold mb-1 text-left">{tooltipText?.title}</Text>
        <Text type="p" secondary classes="text-left">{tooltipText?.body}</Text>
    </Tooltip>
{/if}
