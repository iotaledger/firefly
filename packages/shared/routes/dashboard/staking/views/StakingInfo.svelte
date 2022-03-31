<script lang="typescript">
    import { Animation, Link, Text } from 'shared/components'
    import { Platform } from 'shared/lib/platform'
    import { localize } from '@core/i18n'
    import { ASSEMBLY_EVENT_ID, STAKING_EVENT_IDS } from 'shared/lib/participation/constants'
    import {
        assemblyStakingRemainingTime,
        participationOverview,
        selectedAccountParticipationOverview,
        shimmerStakingRemainingTime,
        stakedAccounts,
        stakingEventState,
    } from 'shared/lib/participation/stores'
    import { ParticipationEventState } from 'shared/lib/participation/types'
    import { getBestTimeDuration } from 'shared/lib/time'
    import { selectedAccountId } from '@lib/wallet'

    let animation: string

    const updateAnimation = (): void => {
        const prefix = 'staking-info'
        if (!$stakingEventState || !$selectedAccountParticipationOverview) {
            animation = `${prefix}-upcoming`
        }

        if ($stakingEventState === ParticipationEventState.Inactive) {
            animation = null
        } else if ($stakingEventState === ParticipationEventState.Holding) {
            const stakingParticipationIds: string[] = []
            $selectedAccountParticipationOverview.participations.forEach((p) => {
                if (!stakingParticipationIds.includes(p.eventId) && STAKING_EVENT_IDS.includes(p.eventId)) {
                    stakingParticipationIds.push(p.eventId)
                }
            })

            let fileNumber = 0
            if (stakingParticipationIds.length >= 2) {
                fileNumber = 3
            } else if (stakingParticipationIds.length === 1) {
                if (stakingParticipationIds[0] === ASSEMBLY_EVENT_ID) {
                    fileNumber = 1
                } else {
                    fileNumber = 2
                }
            }

            animation = `${prefix}-${$stakingEventState}-${fileNumber}`
        } else {
            animation = `${prefix}-${$stakingEventState}`
        }
    }

    $: $stakingEventState, $selectedAccountParticipationOverview, $selectedAccountId, updateAnimation()

    $: localePath = `views.staking.info.${$stakingEventState}`
    $: $assemblyStakingRemainingTime, $shimmerStakingRemainingTime

    const getHeaders = (): [string, string] => {
        if ($stakingEventState === ParticipationEventState.Holding) {
            const isStaking = $stakedAccounts.length > 0
            const localiseHoldingHeader = $stakedAccounts.length > 0 ? 'Holding' : 'NotHolding'
            const localiseHoldingSubHeader = $stakedAccounts.length > 0 ? 'Holding' : 'NotHolding'

            return [
                localize(
                    `${localePath}Header${localiseHoldingHeader}`,
                    isStaking ? { values: { duration: getBestTimeDuration($assemblyStakingRemainingTime) } } : {}
                ),
                localize(`${localePath}Subheader${localiseHoldingSubHeader}`),
            ]
        } else {
            return [localize(`${localePath}Header`), localize(`views.staking.info.${$stakingEventState}Subheader`)]
        }
    }

    let header, subHeader
    $: $participationOverview, ([header, subHeader] = getHeaders())

    stakingEventState.subscribe(() => ([header, subHeader] = getHeaders()))

    const handleLearnMoreClick = (): void => {
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
        <Link onClick={handleLearnMoreClick} classes="text-14">{localize('actions.learnAboutStaking')}</Link>
    </div>
</div>

<style type="text/scss">
    .animation-wrapper {
        max-height: calc(100% - 80px);
        max-width: 700px;
        padding-bottom: 66.56%;
    }
</style>
