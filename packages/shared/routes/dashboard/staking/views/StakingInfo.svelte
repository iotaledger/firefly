<script lang="typescript">
    import { Illustration, Link, Text } from 'shared/components'
    import { Electron } from 'shared/lib/electron'
    import { localize } from 'shared/lib/i18n'
    import {
        assemblyStakingRemainingTime,
        participationOverview,
        shimmerStakingRemainingTime,
        stakedAccounts,
        stakingEventState,
    } from 'shared/lib/participation/stores'
    import { ParticipationEventState, ParticipationOverview } from 'shared/lib/participation/types'
    import { getBestTimeDuration } from 'shared/lib/time'

    const handleExternalLinkClick = (): void => {
        Electron.openUrl('https://firefly.iota.org')
    }

    const getIllustration = (state: ParticipationEventState, overview: ParticipationOverview): string => {
        const prefix = 'staking-info'
        if (!state || !overview) return `${prefix}-upcoming`

        if (state === ParticipationEventState.Holding) {
            let participations: { [eventId: string]: boolean } = { }
            overview.forEach((apo) => apo.participations.forEach((p) => {
                participations[p.eventId] = true
            }))
            const numParticipations = Object.keys(participations).length

            let fileNumber
            if (numParticipations >= 2) {
                fileNumber = 2
            } else if (numParticipations === 1) {
                fileNumber = 1
            } else {
                fileNumber = 0
            }

            return `${prefix}-${state}-${fileNumber}`
        } else {
            return `${prefix}-${state}`
        }
    }

    let localePath
    $: localePath = `views.staking.info.${$stakingEventState}`
    $: $assemblyStakingRemainingTime, $shimmerStakingRemainingTime

    const getHeaders = (): [string, string] => {
        if ($stakingEventState === ParticipationEventState.Holding) {
            const isStaking = $stakedAccounts.length > 0
            const localePathExtra = $stakedAccounts.length > 0 ? 'Holding' : 'NotHolding'

            return [
                localize(
                    `${localePath}Header${localePathExtra}`,
                    isStaking
                        ? { values: { duration: getBestTimeDuration($assemblyStakingRemainingTime) } }
                        : {}
                ),
                localize(`views.staking.info.${$stakingEventState}Subheader`)
            ]
        } else {
            return [localize(`${localePath}Header`), localize(`views.staking.info.${$stakingEventState}Subheader`)]
        }
    }

    let header, subHeader
    $: $participationOverview, [header, subHeader] = getHeaders()

    const handleLearnMoreClick = (): void => {
        Electron.openUrl('https://firefly.iota.org')
    }
</script>

<style type="text/scss">
    ul {
        display: block;
        list-style-type: disc;
        margin-block-start: 0.5em;
        margin-block-end: 1em;
        margin-inline-start: 0px;
        margin-inline-end: 0px;
        padding-inline-start: 20px;
    }
</style>

<div
    class="p-8 flex flex-col justify-center items-center w-full h-full bg-gradient-to-t from-blue-400 to-lightblue-500">
    <Illustration illustration={getIllustration($stakingEventState, $participationOverview)} />
    <div class="w-full mt-4 flex flex-col justify-between items-center text-center">
        <Text type="p" bigger classes="text-gray-900 mb-1" overrideColor>{subHeader}</Text>
        <Text type="h2" classes="text-gray-900 mb-2" overrideColor>{header}</Text>
        <Link onClick={handleLearnMoreClick} classes="text-14">{localize('actions.learnAboutStaking')}</Link>
    </div>
</div>
