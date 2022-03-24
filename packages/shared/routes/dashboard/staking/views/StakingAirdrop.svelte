<script lang="typescript">
    import { HR, Link, StakingAirdropIndicator, Text } from 'shared/components'
    import { localize } from 'shared/lib/i18n'
    import { showAppNotification } from 'shared/lib/notifications'
    import { formatStakingAirdropReward, isStakingForShimmer, isStakingPossible } from 'shared/lib/participation'
    import {
        assemblyStakingRemainingTime,
        assemblyStakingRewards,
        shimmerStakingRemainingTime,
        shimmerStakingRewards,
        stakingEventState,
    } from 'shared/lib/participation/stores'
    import { ParticipationEventState, StakingAirdrop } from 'shared/lib/participation/types'
    import { getBestTimeDuration } from 'shared/lib/time'
    import { capitalize } from 'shared/lib/utils'
    import { Platform } from 'shared/lib/platform'

    export let airdrop: StakingAirdrop

    const isAssembly = (): boolean => airdrop === StakingAirdrop.Assembly

    const parseRemainingTime = (): [string, string] => {
        const formattedValue = getBestTimeDuration(
            isAssembly() ? $assemblyStakingRemainingTime : $shimmerStakingRemainingTime
        )
        const timeAmount = parseFloat(formattedValue).toString()
        const timeUnit = formattedValue.replace(timeAmount.toString(), '')

        return [timeAmount, timeUnit]
    }

    $: [remainingTimeAmount, remainingTimeUnit] = parseRemainingTime()

    const video = {
        [StakingAirdrop.Assembly]: null,
        [StakingAirdrop.Shimmer]: null,
    }

    const handleLearnMoreClick = (): void => {
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

    const getLearnMoreUrl = (): string => {
        switch (airdrop) {
            case StakingAirdrop.Assembly:
                return 'https://assembly.sc'
            case StakingAirdrop.Shimmer:
                return 'https://shimmer.network'
            default:
                return ''
        }
    }

    const getLocalizedDurationText = (state: ParticipationEventState): string => {
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
    <div class="w-full h-full px-8 pb-10 flex flex-col justify-end space-y-5 z-0">
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
        <HR />
        <div class="flex flex-row justify-between space-x-4">
            <div class="flex flex-col">
                <div>
                    <Text type="p" classes="font-bold text-lg inline text-white dark:text-gray-400 break-all">
                        {formatStakingAirdropReward(
                            airdrop,
                            isAssembly() ? $assemblyStakingRewards : $shimmerStakingRewards,
                            6
                        ).split(' ')[0]}
                    </Text>
                    <Text type="p" secondary classes="text-sm inline">
                        {formatStakingAirdropReward(
                            airdrop,
                            isAssembly() ? $assemblyStakingRewards : $shimmerStakingRewards,
                            6
                        ).split(' ')[1]}
                    </Text>
                </div>
                <Text type="p" smaller overrideColor classes="font-normal mt-0.5 text-gray-400 dark:text-gray-400">
                    {localize('views.staking.airdrops.collectedRewards')}
                </Text>
            </div>
            {#if isStakingPossible($stakingEventState)}
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
                        {getLocalizedDurationText($stakingEventState)}
                    </Text>
                </div>
            {/if}
        </div>
    </div>
</div>
