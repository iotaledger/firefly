<script lang="typescript">
    import { Animation, Link, Text } from 'shared/components'
    import { Platform } from 'shared/lib/platform'
    import { localize } from '@core/i18n'
    import {
        assemblyStakingRemainingTime,
        selectedAccountParticipationOverview,
        stakedAccounts,
        stakingEventState,
    } from 'shared/lib/participation/stores'
    import { ParticipationEventState } from 'shared/lib/participation/types'
    import { getBestTimeDuration } from 'shared/lib/time'
    import { selectedAccountId } from '@lib/wallet'

    let animation: string
    let header: string
    let subHeader: string

    $: isAssemblyStaked = $selectedAccountParticipationOverview?.assemblyStakedFunds > 0
    $: isShimmerStaked = $selectedAccountParticipationOverview?.shimmerStakedFunds > 0
    $: $selectedAccountParticipationOverview, $stakingEventState, setHeaders()
    $: isAssemblyStaked, isShimmerStaked, $stakingEventState, $selectedAccountId, setAnimation()

    enum AnimationFileNumber {
        NoStaking = 0,
        Assembly = 1,
        Shimmer = 2,
        AssemblyAndShimmer = 3,
    }

    function setAnimation(): void {
        const prefix = 'staking-info'
        if (!$stakingEventState || !$selectedAccountParticipationOverview) {
            animation = `${prefix}-upcoming`
        }

        if ($stakingEventState === ParticipationEventState.Inactive) {
            animation = null
        } else if ($stakingEventState === ParticipationEventState.Holding) {
            let fileNumber = AnimationFileNumber.NoStaking
            if (isAssemblyStaked && isShimmerStaked) {
                fileNumber = AnimationFileNumber.AssemblyAndShimmer
            } else if (isAssemblyStaked) {
                fileNumber = AnimationFileNumber.Assembly
            } else if (isShimmerStaked) {
                fileNumber = AnimationFileNumber.Shimmer
            }

            animation = `${prefix}-${$stakingEventState}-${fileNumber}`
        } else {
            animation = `${prefix}-${$stakingEventState}`
        }
    }

    function setHeaders(): void {
        const localePath = `views.staking.info.${$stakingEventState}`
        if ($stakingEventState === ParticipationEventState.Holding) {
            const isStaking = $stakedAccounts.length > 0
            const localiseHoldingHeader = isStaking ? 'Holding' : 'NotHolding'
            const localiseHoldingSubHeader = isStaking ? 'Holding' : 'NotHolding'
            const duration = isStaking
                ? { values: { duration: getBestTimeDuration($assemblyStakingRemainingTime) } }
                : {}

            header = localize(`${localePath}Header${localiseHoldingHeader}`, duration)
            subHeader = localize(`${localePath}Subheader${localiseHoldingSubHeader}`)
        } else {
            header = localize(`${localePath}Header`)
            subHeader = localize(`${localePath}Subheader`)
        }
    }

    function onClickLearnMore(): void {
        Platform.openUrl('https://blog.iota.org/iota-staking-start/')
    }
</script>

<div class="p-8 flex flex-col justify-center items-center w-full h-full bg-blue-100 dark:bg-gray-800">
    {#if animation}
        <div class="animation-wrapper relative w-full">
            <Animation
                {animation}
                classes="h-full absolute transform left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            />
        </div>
    {/if}
    <div class="w-full mt-4 flex flex-col items-center text-center">
        <Text type="p" bigger classes="mb-1">{subHeader}</Text>
        <Text type="h2" classes="mb-2">{header}</Text>
        <Link onClick={onClickLearnMore} classes="text-14">{localize('actions.learnAboutStaking')}</Link>
    </div>
</div>

<style type="text/scss">
    .animation-wrapper {
        max-height: calc(100% - 80px);
        max-width: 700px;
        padding-bottom: 66.56%;
    }
</style>
