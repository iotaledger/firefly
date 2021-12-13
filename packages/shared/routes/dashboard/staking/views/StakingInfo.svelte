<script lang="typescript">
    import { Animation, Link, Text } from 'shared/components'
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

    const getAnimation = (state: ParticipationEventState, overview: ParticipationOverview): string => {
        const prefix = 'staking-info'
        if (!state || !overview) return `${prefix}-upcoming`

        if (state === ParticipationEventState.Holding) {
            let numParticipations = 0

            if (overview.some((apo) => apo.shimmerStakedFunds > 0 && apo.assemblyStakedFunds > 0)) {
                numParticipations = 2;
            } else if (overview.some((apo) => apo.shimmerStakedFunds > 0 || apo.assemblyStakedFunds > 0)) {
                numParticipations = 1;
            }

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
                    isStaking ? { values: { duration: getBestTimeDuration($assemblyStakingRemainingTime) } } : {}
                ),
                localize(`views.staking.info.${$stakingEventState}Subheader`),
            ]
        } else {
            return [localize(`${localePath}Header`), localize(`views.staking.info.${$stakingEventState}Subheader`)]
        }
    }

    let header, subHeader
    $: $participationOverview, ([header, subHeader] = getHeaders())

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
    class="p-8 flex flex-col justify-center items-center w-full h-full bg-blue-100 dark:bg-gray-800">
    <Animation animation={getAnimation($stakingEventState, $participationOverview)} />
    <div class="w-full mt-4 flex flex-col items-center text-center">
        <Text type="p" bigger classes="mb-1">{subHeader}</Text>
        <Text type="h2" classes="mb-2">{header}</Text>
        <Link onClick={handleLearnMoreClick} classes="text-14">{localize('actions.learnAboutStaking')}</Link>
    </div>
</div>
