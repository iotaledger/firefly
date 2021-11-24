<script lang="typescript">
    import { Icon, Text, Tooltip } from 'shared/components'
    import { Locale } from 'shared/lib/typings/i18n'
    import { stakedAccounts, stakingEventState } from '../lib/participation'
    import { ParticipationEventState } from '../lib/typings/participation'
    import { tick } from 'svelte'

    export let locale: Locale

    let indicatorIcon = ''
    $: indicatorIcon = getIndicatorIcon($stakingEventState, $stakedAccounts.length > 0)

    let indicatorText = ''
    $: indicatorText = getIndicatorText($stakingEventState, $stakedAccounts.length > 0)

    let showTooltip = false
    let indicatorBox
    let parentWidth = 0
    let parentLeft = 0
    let parentTop = 0
    let position = ""

    $: indicatorBox, showTooltip, void refreshIndicatorBox()

    async function refreshIndicatorBox() {
        if (!indicatorBox || !showTooltip) return

        await tick()

        parentWidth = indicatorBox?.offsetWidth / 2 ?? 0
        parentLeft = indicatorBox?.getBoundingClientRect().left ?? 0
        parentTop = indicatorBox?.getBoundingClientRect().top ?? 0
        position = "right"
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

    const getIndicatorText = (state: ParticipationEventState, isStaked: boolean): string => {
        switch (state) {
            case ParticipationEventState.Upcoming:
                return 'Staking upcoming'
            case ParticipationEventState.Commencing:
                return isStaked ? 'Staking commencing' : 'Staking inactive'
            case ParticipationEventState.Holding:
                return isStaked ? 'Staking active' : 'Staking inactive'
            case ParticipationEventState.Ended:
                return 'Staking ended'
            default:
                return 'Staking inactive'
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
    <Tooltip {parentTop} {parentLeft} {parentWidth} {position}>
        <Text type="p" classes="text-gray-900 bold mb-1 text-left">Event has not yet started</Text>
        <Text type="p" secondary classes="text-left">
            Your staked wallets are ready to start receiving airdrops from December 15th 2021 00:01 CET. You do not have
            to take further action at this time.
        </Text>
    </Tooltip>
 {/if}
