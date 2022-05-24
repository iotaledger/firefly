<script lang="typescript">
    import { localize } from '@core/i18n'
    import { formatNumber } from '@lib/currency'
    import { ParticipationEvent, ParticipationEventState } from '@lib/participation/types'
    import { AccountColor } from '@lib/typings/color'
    import { DashboardPane, Text, Tooltip } from 'shared/components'

    export let event: ParticipationEvent

    const GRAPH_COLORS = [AccountColor.Purple, AccountColor.Turquoise]
    const tooltip = {
        build: { anchor: null as HTMLElement, show: false },
        burn: { anchor: null as HTMLElement, show: false },
    }

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

    function toggleTooltip(type: string, show: boolean): void {
        switch (type) {
            case 'build':
                tooltip.build.show = show
                break
            case 'burn':
                tooltip.burn.show = show
                break
            default:
                break
        }
    }
</script>

<DashboardPane classes="w-full h-full flex flex-col flex-shrink-0 overflow-hidden p-6">
    <Text type="p" smaller classes="mb-8 text-gray-700 dark:text-gray-500" overrideColor>
        {localize(
            `views.governance.eventDetails.${
                event?.status?.status === ParticipationEventState.Ended ? 'finalResult' : 'currentResult'
            }`
        )}
    </Text>
    <div class="w-full h-full flex justify-center">
        {#each results || [] as result, index}
            <!-- Note: the tooltip logic is very ugly because the dynamic anchor allocation wasnt working as expected -->
            <div
                class="h-full flex flex-col justify-end items-center w-1/2 flex-shrink-0`
                    : ''}"
                on:mouseenter={() => toggleTooltip(index === 0 ? 'build' : 'burn', true)}
                on:mouseleave={() => toggleTooltip(index === 0 ? 'build' : 'burn', false)}
            >
                <div
                    class="relative w-12 rounded-t-lg"
                    style="height: {displayedPercentages[index]?.relativePercentage}; background-color: {GRAPH_COLORS[
                        index
                    ]};"
                    bind:this={tooltip[index === 0 ? 'build' : 'burn'].anchor}
                />
                {#if tooltip?.[index === 0 ? 'build' : 'burn']?.show}
                    <Tooltip anchor={tooltip?.[index === 0 ? 'build' : 'burn']?.anchor} position="left" size="small">
                        <Text type="p"
                            >{localize('views.governance.info.tooltip.chart.totalVotes', {
                                values: {
                                    amount: formatNumber(result?.accumulated, 0, 0, 2, true),
                                },
                            })}
                        </Text>
                    </Tooltip>
                {/if}
                <div class="flex flex-col mt-3 items-center">
                    <Text type="h3" classes="text-center">
                        {event?.information?.payload?.questions[0]?.answers[index]?.text}
                    </Text>
                    <Text type="h3" overrideColor classes="text-gray-500">
                        {displayedPercentages[index].percentage}
                    </Text>
                </div>
            </div>
        {/each}
    </div>
</DashboardPane>
