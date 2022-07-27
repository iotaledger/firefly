<script lang="typescript">
    import { HR, Icon, Link, StakingAirdropIndicator, Text, Tooltip } from 'shared/components'
    import { localize } from '@core/i18n'
    import { showAppNotification } from 'shared/lib/notifications'
    import { formatStakingAirdropReward, isParticipationPossible } from 'shared/lib/participation'
    import {
        assemblyStakingEventState,
        assemblyStakingRemainingTime,
        shimmerStakingRemainingTime,
        shimmerStakingEventState,
    } from 'shared/lib/participation/stores'
    import {
        currentAssemblyStakingRewards,
        currentShimmerStakingRewards,
        totalAssemblyStakingRewards,
        totalShimmerStakingRewards,
    } from 'shared/lib/participation/account'
    import { ParticipationEventState, StakingAirdrop } from 'shared/lib/participation/types'
    import { getBestTimeDuration } from 'shared/lib/time'
    import { capitalize } from 'shared/lib/utils'
    import { Platform } from 'shared/lib/platform'

    export let airdrop: StakingAirdrop

    let remainingTimeAmount: string
    let remainingTimeUnit: string

    let rewardsWrapperWidth: number
    let stakingAirdropWidth: number

    const video = {
        [StakingAirdrop.Assembly]: null,
        [StakingAirdrop.Shimmer]: null,
    }

    $: $assemblyStakingRemainingTime, $shimmerStakingRemainingTime, parseRemainingTime()

    const isAssembly = airdrop === StakingAirdrop.Assembly

    const SHOW_SHIMMER_TOKEN_FORMATTING_WARNING = !isAssembly
    let showTooltip = false
    let tooltipAnchor: HTMLElement

    let stakingEventState = ParticipationEventState.Inactive
    $: stakingEventState = isAssembly ? $assemblyStakingEventState : $shimmerStakingEventState

    function toggleTooltip(): void {
        showTooltip = !showTooltip
    }

    function getFormattedStakingAirdropRewards(forCurrentRewards: boolean, stakingRewards: number): string {
        return formatStakingAirdropReward(airdrop, stakingRewards, 6)
    }

    $: currentStakingRewards = getFormattedStakingAirdropRewards(
        true,
        isAssembly ? $currentAssemblyStakingRewards : $currentShimmerStakingRewards
    )
    $: totalStakingRewards = getFormattedStakingAirdropRewards(
        false,
        isAssembly ? $totalAssemblyStakingRewards : $totalShimmerStakingRewards
    )

    function parseRemainingTime(): void {
        const stakingRemainingTime = isAssembly ? $assemblyStakingRemainingTime : $shimmerStakingRemainingTime
        const formattedValue = getBestTimeDuration(stakingRemainingTime)

        remainingTimeAmount = parseFloat(formattedValue).toString()
        remainingTimeUnit = formattedValue.replace(remainingTimeAmount.toString(), '')
    }

    function handleLearnMoreClick(): void {
        const url = getLearnMoreUrl()
        if (!url) {
            showAppNotification({
                type: 'error',
                message: localize('error.participation.cannotVisitAirdropWebsite', {
                    values: { airdrop: capitalize(airdrop) },
                }),
            })
        }

        Platform.openUrl(getLearnMoreUrl())
    }

    function getLearnMoreUrl(): string {
        switch (airdrop) {
            case StakingAirdrop.Assembly:
                return 'https://assembly.sc'
            case StakingAirdrop.Shimmer:
                return 'https://shimmer.network'
            default:
                return ''
        }
    }

    function getLocalizedDurationText(state: ParticipationEventState): string {
        let stateText: string
        switch (state) {
            case ParticipationEventState.Commencing:
                stateText = 'commencing'
                break
            case ParticipationEventState.Holding:
                stateText = 'holding'
                break
            default:
                stateText = 'remaining'
                break
        }

        return localize(`views.staking.airdrops.${stateText}`)
    }
</script>

<div
    class="relative z-0 flex w-full h-full bg-{airdrop}-bg"
    on:mouseenter={video[airdrop]?.play()}
    on:mouseleave={video[airdrop]?.pause()}
    bind:clientWidth={stakingAirdropWidth}
>
    <!-- svelte-ignore a11y-media-has-caption -->
    <video
        class="absolute top-0 left-0 w-full h-auto z-0"
        width="100%"
        height="auto"
        controls={false}
        muted
        playsinline
        loop
        bind:this={video[airdrop]}
    >
        <source src="assets/videos/airdrop-{airdrop}.mp4" type="video/mp4" />
    </video>
    <div class="w-40 h-40 overflow-hidden absolute -top-2.5 -right-2.5">
        <div
            class="ribbon absolute left-0 top-11 transform rotate-45 p-1 {airdrop === StakingAirdrop.Assembly
                ? 'bg-blue-500'
                : 'bg-gray-700'}"
        >
            <Text type="h4" overrideColor classes="text-center text-white"
                >{localize(`views.staking.banners.${airdrop === StakingAirdrop.Assembly ? 'new' : 'complete'}`)}</Text
            >
        </div>
    </div>
    <div class="w-full h-full px-6 pb-10 flex flex-col justify-end z-0">
        <!-- We check if assembly staking is possible to have both airdrops aligned -->
        <div
            class="{isParticipationPossible($assemblyStakingEventState)
                ? 'apply-min-height'
                : ''} flex flex-col flex-wrap justify-between space-y-5"
        >
            <div class="flex flex-col">
                <div class="flex flex-row items-center mb-3">
                    <Text type="h3" classes="mr-4 text-white text-xl">
                        {localize(`views.staking.airdrops.${airdrop}.name`)}
                    </Text>
                    <StakingAirdropIndicator {airdrop} />
                </div>
                <Text
                    type="p"
                    overrideColor
                    overrideLeading
                    smaller
                    classes="font-normal text-gray-300 dark:text-gray-300 mb-3"
                >
                    {localize(`views.staking.airdrops.${airdrop}.description`)}
                </Text>
                <Link onClick={handleLearnMoreClick} classes="text-14">{localize('actions.visitWebsite')}</Link>
            </div>
            <div class="flex flex-col flex-wrap space-y-5">
                {#if isParticipationPossible(stakingEventState)}
                    <div class="flex flex-row justify-between space-x-4">
                        <div class="flex flex-col">
                            <div>
                                <Text
                                    type="p"
                                    classes="font-bold text-lg inline text-white dark:text-gray-400 break-all"
                                >
                                    {currentStakingRewards.split(' ')[0]}
                                </Text>
                                <Text type="p" secondary classes="text-sm inline">
                                    {currentStakingRewards.split(' ')[1]}
                                </Text>
                            </div>
                            <Text
                                type="p"
                                smaller
                                overrideColor
                                classes="font-normal mt-0.5 text-gray-400 dark:text-gray-400"
                            >
                                {localize('views.staking.airdrops.currentStakingPeriod')}
                            </Text>
                        </div>
                        {#if isParticipationPossible(stakingEventState)}
                            <div class="flex flex-col text-right">
                                <div>
                                    <Text type="p" classes="font-bold text-lg inline text-white dark:text-white">
                                        {remainingTimeAmount}
                                    </Text>
                                    <Text type="p" secondary classes="text-sm inline">{remainingTimeUnit}</Text>
                                </div>
                                <Text
                                    type="p"
                                    smaller
                                    overrideColor
                                    classes="font-normal text-sm mt-0.5 text-gray-400 dark:text-gray-400"
                                >
                                    {getLocalizedDurationText(stakingEventState)}
                                </Text>
                            </div>
                        {/if}
                    </div>
                {/if}
                <HR />
                <div class="flex flex-row justify-between space-x-4">
                    <div class="flex flex-col" bind:clientWidth={rewardsWrapperWidth}>
                        <div class="flex flex-row items-center space-x-1">
                            <Text type="p" classes="font-bold text-lg inline text-white dark:text-gray-400 break-all">
                                {totalStakingRewards.split(' ')[0]}
                            </Text>
                            <Text type="p" secondary classes="text-sm inline">
                                {totalStakingRewards.split(' ')[1]}
                            </Text>
                            {#if SHOW_SHIMMER_TOKEN_FORMATTING_WARNING}
                                <div
                                    bind:this={tooltipAnchor}
                                    on:mouseenter={toggleTooltip}
                                    on:mouseleave={toggleTooltip}
                                >
                                    <Icon
                                        icon="exclamation"
                                        width="17"
                                        height="17"
                                        classes="fill-current text-gray-500 group-hover:text-gray-900"
                                    />
                                </div>
                            {/if}
                        </div>
                        <Text
                            type="p"
                            smaller
                            overrideColor
                            classes="font-normal mt-0.5 text-gray-400 dark:text-gray-400"
                        >
                            {localize('views.staking.airdrops.totalWalletRewards')}
                        </Text>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
{#if showTooltip}
    <Tooltip anchor={tooltipAnchor} position={rewardsWrapperWidth > 0.5 * stakingAirdropWidth ? 'left' : 'right'}>
        <Text type="p" classes="text-gray-900 bold mb-2 text-left"
            >{localize('tooltips.shimmerTokenFormatting.title')}</Text
        >
        <Text type="p" secondary classes="text-left">
            {localize('tooltips.shimmerTokenFormatting.body')}
        </Text>
    </Tooltip>
{/if}

<style type="text/scss">
    .apply-min-height {
        min-height: 310px;
    }
    .ribbon {
        width: 120%;
    }
</style>
