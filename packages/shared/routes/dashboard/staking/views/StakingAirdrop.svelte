<script lang="typescript">
    import { HR, Illustration, Link, Text } from 'shared/components'
    import { Electron } from 'shared/lib/electron'
    import { Locale } from 'shared/lib/typings/i18n'
    import {
        assemblyStakingRemainingTime,
        assemblyStakingRewards,
        shimmerStakingRemainingTime,
        shimmerStakingRewards,
        STAKING_AIRDROP_TOKENS,
    } from 'shared/lib/participation'
    import { StakingAirdrop } from 'shared/lib/typings/participation'
    import { getBestTimeDuration } from 'shared/lib/time'

    export let locale: Locale
    export let airdrop: StakingAirdrop

    const isAssembly = (): boolean => airdrop === StakingAirdrop.Assembly
    const isShimmer = (): boolean => airdrop === StakingAirdrop.Shimmer

    let remainingTimeAmount, remainingTimeUnit
    $: {
        [remainingTimeAmount, remainingTimeUnit] = getBestTimeDuration(
            isAssembly() ? $assemblyStakingRemainingTime : $shimmerStakingRemainingTime
        ).split(' ')
    }

    const handleLearnMoreClick = (): void => {
        Electron.openUrl(getLearnMoreUrl())
    }

    const getLearnMoreUrl = (): string => {
        switch (airdrop) {
            case StakingAirdrop.Assembly:
                return 'https://shimmer.network'
            case StakingAirdrop.Shimmer:
                return 'https://shimmer.network'
            default:
                return ''
        }
    }
</script>

<style type="text/scss">
    .airdrop-grid {
        @apply grid;
        grid-template-rows: 45% 55%;
    }
</style>

<div class="airdrop-grid w-full h-full bg-{airdrop}-bg dark:bg-shimmer-bg">
    <div class="flex flex-column justify-center">
        <Illustration illustration="{airdrop}-airdrop-bg" width="100%" height="100%" classes="fill-current text-white" />
    </div>
    <div class="px-8 h-full pb-10 flex flex-col justify-end">

        <div>
            <Text type="h3" classes="mb-2 text-{isAssembly() ? 'gray-800' : 'white'}">
                {locale(`views.staking.airdrops.${airdrop}.name`)}
            </Text>
            <Text
                type="p"
                overrideColor
                overrideLeading
                classes="mb-3 font-normal text-sm  leading-140 text-{isAssembly() ? 'gray-700' : 'gray-300'} dark:text-gray-300">
                {locale(`views.staking.airdrops.${airdrop}.description`)}
            </Text>
            <Link onClick={handleLearnMoreClick} classes="text-{airdrop}-highlight text-14">
                {locale('actions.visitWebsite')}
            </Link>
        </div>
        <div>
            <HR classes="my-8" />
            <div class="flex flex-row space-x-2">
                <div class="flex flex-col w-2/3">
                    <div>
                        <Text type="p" classes="font-bold text-lg inline text-{isAssembly() ? 'gray-800' : 'white'} dark:text-white">
                            {remainingTimeAmount}
                        </Text>
                        <Text
                            type="p"
                            overrideColor
                            classes="text-sm inline text-{isAssembly() ? 'gray-600' : 'gray-400'} dark:text-gray-400">
                            {remainingTimeUnit}
                        </Text>
                    </div>
                    <Text
                        type="p"
                        smaller
                        overrideColor
                        classes="font-normal text-sm mt-0.5 text-{isAssembly() ? 'gray-700' : 'gray-400'}  dark:text-gray-400">
                        {locale('views.staking.airdrops.remaining')}
                    </Text>
                </div>
                <div class="flex flex-col w-1/2">
                    <div>
                        <Text type="p" classes="font-bold text-lg inline text-{isAssembly() ? 'gray-800' : 'white'}  dark:text-gray-400">
                            {isAssembly() ? $assemblyStakingRewards : $shimmerStakingRewards}
                        </Text>
                        <Text type="p" secondary classes="text-sm inline">{STAKING_AIRDROP_TOKENS[airdrop]}</Text>
                    </div>
                    <Text
                        type="p"
                        smaller
                        overrideColor
                        classes="font-normal mt-0.5 text-{isAssembly() ? 'gray-700' : 'gray-400'}  dark:text-gray-400">
                        {locale('views.staking.airdrops.collectedRewards')}
                    </Text>
                </div>
            </div>
        </div>
    </div>
</div>
