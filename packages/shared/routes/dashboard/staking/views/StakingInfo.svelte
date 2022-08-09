<script lang="typescript">
    import { Animation, Link, Text, Illustration, Spinner } from 'shared/components'
    import { Platform } from 'shared/lib/platform'
    import {
        assemblyStakingEventState,
        assemblyStakingRemainingTime,
        isFetchingParticipationInfo,
    } from 'shared/lib/participation/stores'
    import { formatDate, LocaleArguments, localize } from '@core/i18n'
    import {
        currentAssemblyStakingRewards,
        currentAssemblyStakingRewardsBelowMinimum,
        currentShimmerStakingRewards,
        currentShimmerStakingRewardsBelowMinimum,
        selectedAccountParticipationOverview,
        totalAssemblyStakingRewards,
        totalShimmerStakingRewards,
    } from 'shared/lib/participation/account'
    import { ParticipationEventState } from 'shared/lib/participation/types'
    import { getBestTimeDuration } from 'shared/lib/time'
    import { selectedAccountIdStore } from '@lib/wallet'
    import { Token } from '@lib/typings/assets'
    import { ASSEMBLY_EVENT_ID, ASSEMBLY_EVENT_START_DATE, SHIMMER_EVENT_ID } from '@lib/participation'
    import { getStakingEventFromAirdrop } from '@lib/participation/staking'
    import { StakingAirdrop } from '@lib/participation/types'

    enum StakingAnimation {
        Prestaking = 'prestaking',
        Neither = 'staking-neither',
        Both = 'staking-both',
        AssemblyWithShimmerRewards = 'staking-assembly-with-shimmer-rewards',
        AssemblyWithoutShimmerRewards = 'staking-assembly-without-shimmer-rewards',
        ShimmerWithAssemblyRewards = 'staking-shimmer-with-assembly-rewards',
        ShimmerWithoutAssemblyRewards = 'staking-shimmer-without-assembly-rewards',
        Ended = 'ended',
    }

    let animation: StakingAnimation = null
    let header: string
    let body: string

    let isAssemblyStaked = false
    $: isAssemblyStaked = $selectedAccountParticipationOverview?.assemblyStakedFunds > 0

    let isShimmerStaked = false
    $: isShimmerStaked = $selectedAccountParticipationOverview?.shimmerStakedFunds > 0

    let stakingEventState = ParticipationEventState.Inactive
    $: stakingEventState = $assemblyStakingEventState

    $: $selectedAccountParticipationOverview, stakingEventState, setText()
    $: isAssemblyStaked,
        isShimmerStaked,
        stakingEventState,
        $selectedAccountParticipationOverview,
        $selectedAccountIdStore,
        setAnimation()

    function setAnimation(): void {
        switch (stakingEventState) {
            case ParticipationEventState.Upcoming:
            case ParticipationEventState.Commencing:
                animation = StakingAnimation.Prestaking
                break
            case ParticipationEventState.Holding: {
                if (!$selectedAccountParticipationOverview) {
                    animation = StakingAnimation.Neither
                } else {
                    const participatingEventIds =
                        $selectedAccountParticipationOverview?.participations?.map((p) => p.eventId) ?? []

                    const isStakingForAssembly = participatingEventIds.includes(ASSEMBLY_EVENT_ID)
                    const isStakingForShimmer = participatingEventIds.includes(SHIMMER_EVENT_ID)

                    if (isStakingForAssembly && isStakingForShimmer) {
                        animation = StakingAnimation.Both
                    } else if (!isStakingForAssembly && !isStakingForShimmer) {
                        animation = StakingAnimation.Neither
                    } else {
                        if (isStakingForAssembly) {
                            const hasShimmerRewards = $totalShimmerStakingRewards > 0
                            animation = hasShimmerRewards
                                ? StakingAnimation.AssemblyWithShimmerRewards
                                : StakingAnimation.AssemblyWithoutShimmerRewards
                        } else if (isStakingForShimmer) {
                            const hasAssemblyRewards = $totalAssemblyStakingRewards > 0
                            animation = hasAssemblyRewards
                                ? StakingAnimation.ShimmerWithAssemblyRewards
                                : StakingAnimation.ShimmerWithoutAssemblyRewards
                        } else {
                            animation = StakingAnimation.Neither
                        }
                    }
                }

                break
            }
            case ParticipationEventState.Ended:
                animation = StakingAnimation.Ended
                break
            case ParticipationEventState.Inactive:
            default:
                animation = null
                break
        }
    }

    function setText(): void {
        const baseLocalePath = 'views.staking.info'

        if (
            stakingEventState === ParticipationEventState.Upcoming ||
            stakingEventState === ParticipationEventState.Commencing
        ) {
            const dateArgument = formatDate(ASSEMBLY_EVENT_START_DATE, { format: 'long' })
            const localeArguments = { values: { token: Token.IOTA, date: dateArgument } }

            header = localize(`${baseLocalePath}.headers.${stakingEventState}`)
            body = localize(`${baseLocalePath}.bodies.${stakingEventState}`, localeArguments)
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
                ($currentShimmerStakingRewardsBelowMinimum > 0 && $currentShimmerStakingRewards <= 0)
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
        Platform.openUrl('https://blog.iota.org/iota-staking-for-assembly-part-3/')
    }
</script>

<div class="p-8 flex flex-col justify-center items-center w-full h-full bg-white-100 dark:bg-gray-800">
    {#if $isFetchingParticipationInfo && !getStakingEventFromAirdrop(StakingAirdrop.Assembly)}
        <Illustration illustration="governance-not-found" classes="w-36 h-36 mb-6" />
        <Spinner
            busy={$isFetchingParticipationInfo}
            message={localize('views.staking.info.headers.fetching')}
            classes="justify-center"
        />
    {:else}
        {#if animation}
            <div class="animation-wrapper relative w-full">
                <Animation
                    animation="staking-{animation}"
                    classes="h-full absolute transform left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                />
            </div>
        {/if}
        <div class="w-full mt-4 flex flex-col items-center text-center">
            <Text type="h2" classes="mb-4">{header}</Text>
            <Text type="p">{body}</Text>
            <Link onClick={onClickLearnMore} classes="mt-4 text-14">{localize('actions.readMore')}</Link>
        </div>
    {/if}
</div>

<style type="text/scss">
    .animation-wrapper {
        max-height: calc(100% - 120px);
        max-width: 700px;
        padding-bottom: 58%;
    }
</style>
