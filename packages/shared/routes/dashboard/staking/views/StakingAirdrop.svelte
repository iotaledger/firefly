<script lang="typescript">
    import { HR, Illustration, Link, StakingAirdropIndicator, Text } from 'shared/components'
    import { Electron } from 'shared/lib/electron'
    import { localize } from 'shared/lib/i18n'
    import { showAppNotification } from 'shared/lib/notifications'
    import { getBestTimeDuration } from 'shared/lib/time'
    import { capitalize } from 'shared/lib/utils'

    import { formatStakingAirdropReward } from 'shared/lib/participation'
    import {
        assemblyStakingRemainingTime,
        assemblyStakingRewards,
        shimmerStakingRemainingTime,
        shimmerStakingRewards
    } from 'shared/lib/participation/stores'
    import { StakingAirdrop } from 'shared/lib/participation/types'

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
        const url = getLearnMoreUrl()
        if (!url) {
            showAppNotification({
                type: 'error',
                message: localize(
                    'error.participation.cannotVisitAirdropWebsite',
                    { values: { airdrop: capitalize(airdrop) } }
                )
            })
        }

        Electron.openUrl(getLearnMoreUrl())
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
</script>

<style type="text/scss">
    .airdrop-grid {
        @apply grid;
        grid-template-rows: 45% 55%;
    }
</style>

<div class="airdrop-grid w-full h-full bg-{airdrop}-bg dark:bg-{airdrop}-bg">
    <div class="flex flex-column justify-center">
        <Illustration
            illustration="airdrop-{airdrop}-bg"
            width="100%"
            height="100%"
            classes="{airdrop === StakingAirdrop.Assembly ? 'opacity-20' : ''} fill-current text-white"
        />
    </div>
    <div class="px-8 h-full pb-10 flex flex-col justify-end">
        <div class="h-1/2 flex flex-col justify-between">
            <div class="mb-4 flex flex-row items-center">
                <Text type="h3" classes="mr-4 text-white text-2xl">
                    {localize(`views.staking.airdrops.${airdrop}.name`)}
                </Text>
                <StakingAirdropIndicator {airdrop} />
            </div>
            <Text type="p" overrideColor overrideLeading classes="mb-3 font-normal text-sm  leading-140 text-gray-300 dark:text-gray-300">
                {localize(`views.staking.airdrops.${airdrop}.description`)}
            </Text>
            <Link onClick={handleLearnMoreClick} classes="text-{airdrop}-highlight text-14">
                {localize('actions.visitWebsite')}
            </Link>
        </div>
        <div>
            <HR classes="my-8" />
            <div class="flex flex-row space-x-2">
                <div class="flex flex-col w-1/2">
                    <div>
                        <Text type="p" classes="font-bold text-lg inline text-white dark:text-white">{remainingTimeAmount}</Text>
                        <Text type="p" secondary classes="text-sm inline">{remainingTimeUnit}</Text>
                    </div>
                    <Text type="p" smaller overrideColor classes="font-normal text-sm mt-0.5 text-gray-400 dark:text-gray-400">
                        {localize('views.staking.airdrops.remaining')}
                    </Text>
                </div>
                <div class="flex flex-col w-1/2">
                    <div>
                        <Text type="p" classes="font-bold text-lg inline text-white dark:text-gray-400">
                            {formatStakingAirdropReward(airdrop, isAssembly() ? $assemblyStakingRewards : $shimmerStakingRewards, 6).split(' ')[0]}
                        </Text>
                        <Text type="p" secondary classes="text-sm inline">
                            {formatStakingAirdropReward(airdrop, isAssembly() ? $assemblyStakingRewards : $shimmerStakingRewards, 6).split(' ')[1]}
                        </Text>
                    </div>
                    <Text type="p" smaller overrideColor classes="font-normal mt-0.5 text-gray-400 dark:text-gray-400">
                        {localize('views.staking.airdrops.collectedRewards')}
                    </Text>
                </div>
            </div>
        </div>
    </div>
</div>
