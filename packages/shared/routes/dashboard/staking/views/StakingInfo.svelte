<script lang="typescript">
    import { Animation, Link, Text } from 'shared/components'
    import { Platform } from 'shared/lib/platform'
    import { LocaleArguments, localize } from '@core/i18n'
    import {
        assemblyStakingEventState,
        assemblyStakingRemainingTime,
        currentAssemblyStakingRewards,
        currentAssemblyStakingRewardsBelowMinimum,
        currentShimmerStakingRewards,
        currentShimmerStakingRewardsBelowMinimum,
        selectedAccountParticipationOverview,
        stakedAccounts,
    } from 'shared/lib/participation/stores'
    import { ParticipationEventState } from 'shared/lib/participation/types'
    import { getBestTimeDuration } from 'shared/lib/time'
    import { selectedAccountId } from '@lib/wallet'
    import { Token } from '@lib/typings/assets'

    let animation: string
    let header: string
    let body: string

    let isAssemblyStaked = false
    $: isAssemblyStaked = $selectedAccountParticipationOverview?.assemblyStakedFunds > 0

    let isShimmerStaked = false
    $: isShimmerStaked = $selectedAccountParticipationOverview?.shimmerStakedFunds > 0

    let stakingEventState = ParticipationEventState.Inactive
    $: stakingEventState = $assemblyStakingEventState

    $: $selectedAccountParticipationOverview, stakingEventState, setText()
    $: isAssemblyStaked, isShimmerStaked, stakingEventState, $selectedAccountId, setAnimation()

    enum AnimationFileNumber {
        NoStaking = 0,
        Assembly = 1,
        Shimmer = 2,
        AssemblyAndShimmer = 3,
    }

    function setAnimation(): void {
        const prefix = 'staking-info'
        if (!stakingEventState || !$selectedAccountParticipationOverview) {
            animation = `${prefix}-upcoming`
        }

        if (stakingEventState === ParticipationEventState.Inactive) {
            animation = null
        } else if (stakingEventState === ParticipationEventState.Holding) {
            let fileNumber = AnimationFileNumber.NoStaking
            if (isAssemblyStaked && isShimmerStaked) {
                fileNumber = AnimationFileNumber.AssemblyAndShimmer
            } else if (isAssemblyStaked) {
                fileNumber = AnimationFileNumber.Assembly
            } else if (isShimmerStaked) {
                fileNumber = AnimationFileNumber.Shimmer
            }

            animation = `${prefix}-${stakingEventState}-${fileNumber}`
        } else {
            animation = `${prefix}-${stakingEventState}`
        }
    }

    function setText(): void {
        const baseLocalePath = 'views.staking.info'

        if (
            stakingEventState === ParticipationEventState.Upcoming ||
            stakingEventState === ParticipationEventState.Commencing
        ) {
            header = localize(`${baseLocalePath}.headers.${stakingEventState}`)
            body = localize(`${baseLocalePath}.bodies.${stakingEventState}`, { values: { token: Token.IOTA } })
        } else if (stakingEventState === ParticipationEventState.Holding) {
            const isStaking = isAssemblyStaked || isShimmerStaked
            const tokenArguments: LocaleArguments = isStaking ? {} : { values: { token: Token.IOTA } }
            const durationArguments: LocaleArguments = {
                values: { duration: getBestTimeDuration($assemblyStakingRemainingTime) },
            }

            header = localize(`${baseLocalePath}.headers.${stakingEventState}`, durationArguments)
            body = localize(
                `${baseLocalePath}.bodies.${stakingEventState}And${isStaking ? '' : 'Not'}Staking`,
                tokenArguments
            )
        } else if (stakingEventState === ParticipationEventState.Ended) {
            const didStake = $currentAssemblyStakingRewards > 0 || $currentShimmerStakingRewards > 0
            const isBelowMinimum =
                ($currentAssemblyStakingRewardsBelowMinimum > 0 && $currentAssemblyStakingRewards <= 0) ||
                ($currentShimmerStakingRewardsBelowMinimum > 0 && currentShimmerStakingRewards <= 0)
            const subLocalePath = isBelowMinimum ? 'NotReachMinRewards' : didStake ? 'Stake' : 'NotStake'
            const tokenArguments: LocaleArguments = isBelowMinimum
                ? { values: { token: Token.IOTA } }
                : didStake
                ? { values: { token: Token.IOTA } }
                : {}

            header = localize(`${baseLocalePath}.headers.${stakingEventState}`)
            body = localize(`${baseLocalePath}.bodies.${stakingEventState}AndDid${subLocalePath}`, tokenArguments)
        } else {
            header = localize(`${baseLocalePath}.headers.${stakingEventState}`)
            body = localize(`${baseLocalePath}.bodies.${stakingEventState}`)
        }
    }

    function onClickLearnMore(): void {
        Platform.openUrl('https://blog.iota.org/iota-staking-start/')
    }
</script>

<div class="p-8 flex flex-col justify-center items-center w-full h-full bg-white-100 dark:bg-gray-800">
    {#if animation}
        <div class="animation-wrapper relative w-full">
            <Animation
                {animation}
                classes="h-full absolute transform left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            />
        </div>
    {/if}
    <div class="w-full mt-4 flex flex-col items-center text-center">
        <Text type="h2" classes="mb-6">{header}</Text>
        <Text type="p">{body}</Text>
        <Link onClick={onClickLearnMore} classes="mt-6 text-14">{localize('actions.readMore')}</Link>
    </div>
</div>

<style type="text/scss">
    .animation-wrapper {
        max-height: calc(100% - 80px);
        max-width: 700px;
        padding-bottom: 66.56%;
    }
</style>
