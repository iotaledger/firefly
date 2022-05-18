<script lang="typescript">
    import { localize } from '@core/i18n'
    import { formatNumber } from '@lib/currency'
    import { ParticipationEvent, ParticipationEventState } from '@lib/participation/types'
    import { AccountColor } from '@lib/typings/color'
    import { DashboardPane, Text } from 'shared/components'

    export let event: ParticipationEvent

    $: displayedPercentages = results?.map((result) => {
        const percentage = getPercentageString(result?.accumulated, totalVotes)
        const relativePercentage = getPercentageString(
            result?.accumulated,
            Math.max(...results.map((result) => result?.accumulated))
        )
        return { percentage, relativePercentage }
    })
    $: results = event?.status?.questions?.[0]?.answers?.filter(
        (answer) => answer?.value !== 0 && answer?.value !== 255
    )
    $: totalVotes = results?.reduce((acc, val) => acc + val?.accumulated, 0)

    const getPercentageString = (dividend: number, divisor: number): string =>
        (Math.round((dividend / divisor) * 100) || 0) + '%'
</script>

<DashboardPane classes="w-full h-full flex flex-col flex-shrink-0 overflow-hidden p-6">
    <Text type="p" smaller classes="mb-8 text-gray-700 dark:text-gray-500" overrideColor>
        {localize(
            `views.governance.eventDetails.${
                event?.status?.status === ParticipationEventState.Ended ? 'finalResult' : 'currentResult'
            }`
        )}
    </Text>
    <div class="w-full h-full flex justify-center space-x-8">
        {#each results || [] as result, i}
            <div class="h-full flex flex-col justify-end items-center">
                <div
                    class="w-12 rounded-t-lg"
                    style="height: {displayedPercentages[i]?.relativePercentage}; background-color: {Object.values(
                        AccountColor
                    )[i]};"
                />
                <div class="flex space-x-1 mt-3" style="max-width: 7rem">
                    <Text type="h3" classes="w-full whitespace-nowrap overflow-hidden">
                        {event?.information?.payload?.questions[0]?.answers[i]?.text?.split(' ')[0]}
                    </Text>
                    <Text type="h3" overrideColor classes="text-gray-500">
                        {displayedPercentages[i].percentage}
                    </Text>
                </div>
                <Text type="p" overrideColor bigger classes="text-gray-500 m-0 max-w-36 break-all">
                    {formatNumber(result?.accumulated, 0, 0, 2, true)}
                </Text>
            </div>
        {/each}
    </div>
</DashboardPane>
