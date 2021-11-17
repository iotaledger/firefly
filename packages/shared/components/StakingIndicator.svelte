<script lang="typescript">
    import { Icon, Text, Tooltip } from 'shared/components'
    import { Locale } from 'shared/lib/typings/i18n'
    import { stakedAccounts, stakingEventStatus } from '../lib/participation'
    import { StakingEventStatus } from '../lib/typings/participation'
    import { tick } from 'svelte'

    export let locale: Locale

    // TODO: Remove and let polling automatically handle event statuses
    stakingEventStatus.set(StakingEventStatus.Active)

    $: indicatorIcon = getIndicatorIcon($stakingEventStatus, $stakedAccounts.length > 0)
    $: indicatorText = getIndicatorText($stakingEventStatus, $stakedAccounts.length > 0)

    let showTooltip = false

    let indicatorBox
    let parentWidth = 0
    let parentLeft = 0
    let parentTop = 0

    const refreshIndicatorBox = async (): Promise<void> => {
        if (!indicatorBox || !showTooltip) return

        await tick()

        parentWidth = indicatorBox?.offsetWidth / 2 ?? 0
        parentLeft = indicatorBox?.getBoundingClientRect().left ?? 0
        parentTop = indicatorBox?.getBoundingClientRect().top ?? 0
    }

    $: indicatorBox, showTooltip, void refreshIndicatorBox()

    const toggleTooltip = (): void => {
        showTooltip = !showTooltip
    }

    const getIndicatorIcon = (status: StakingEventStatus, isActive: boolean): string => {
        switch (status) {
            case StakingEventStatus.PreStake:
                return isActive ? 'timer' : 'unlock'
            case StakingEventStatus.Active:
                return isActive ? 'lock' : 'unlock'
            case StakingEventStatus.Ended:
            default:
                return 'unlock'
        }
    }

    const getIndicatorText = (status: StakingEventStatus, isActive: boolean): string => {
        switch (status) {
            case StakingEventStatus.Active:
                return isActive ? 'Staking active' : 'Staking inactive'
            case StakingEventStatus.PreStake:
            case StakingEventStatus.Ended:
            default:
                return 'Staking inactive'
        }
    }
</script>


{#if $stakingEventStatus !== StakingEventStatus.Ended}
    <div class="p-4 flex flex-row justify-between items-center rounded-2xl bg-blue-100">
        <Icon icon={indicatorIcon} classes="fill-current text-blue-500" />
        <Text type="p" classes="mx-3">
            {indicatorText}
        </Text>
        <div>
<!--            bind:this={indicatorBox}-->
<!--            on:mouseenter={toggleTooltip}-->
<!--            on:mouseleave={toggleTooltip}-->
            <Icon
                icon="info-filled"
                classes="fill-current text-gray-600 transform translate-y-1"
            />
        </div>
    </div>
    {#if showTooltip}
        <Tooltip {parentTop} {parentLeft} {parentWidth}>
            <Text type="p" classes="">
                Event has not started yet
            </Text>
            <Text type="p" secondary classes="">
                Your staked wallets are ready to start receiving
                airdrops from December 15th 2021 00:01 CET. You do not
                have to take further action at this time.
            </Text>
        </Tooltip>
    {/if}
{/if}
