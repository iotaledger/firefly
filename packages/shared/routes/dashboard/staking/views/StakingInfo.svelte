<script lang="typescript">
    import { Illustration, Link, Text } from 'shared/components'
    import { Electron } from 'shared/lib/electron'
    import { localize } from 'shared/lib/i18n'
    import {
        assemblyStakingRemainingTime,
        participationOverview, shimmerStakingRemainingTime,
        stakedAccounts,
        stakingEventState
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
            let maxParticipations = overview.map((apo) => apo.participations.length).sort()[overview.length - 1]
            if (maxParticipations >= 2) {
                maxParticipations = 2
            }

            return `${prefix}-${state}-${maxParticipations}`
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

<div class="p-8 flex flex-col justify-center items-center w-full h-full bg-gradient-to-t from-blue-400 to-lightblue-500">
    <Illustration illustration={getIllustration($stakingEventState, $participationOverview)} />
    <div class="mt-4 flex flex-col justify-between text-center">
        <Text type="p" classes="text-xl">{subHeader}</Text>
        <Text type="p" classes="font-extrabold text-2xl">{header}</Text>
        <Link onClick={handleLearnMoreClick} classes="mt-2 text-lightblue-200">
            {localize('actions.learnAboutStaking')}
        </Link>
    </div>
</div>
