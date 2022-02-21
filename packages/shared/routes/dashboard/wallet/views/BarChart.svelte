<script lang="typescript">
    import { Chart, Text } from 'shared/components'
    import { getAccountActivityData } from 'shared/lib/chart'
    import { localize } from 'shared/lib/i18n'
    import { activeProfile, getColor } from 'shared/lib/profile'
    import { selectedAccount } from 'shared/lib/wallet'

    let chartData = {
        incoming: {},
        outgoing: {},
        labels: [],
    }
    $: incoming = chartData.incoming
    $: outgoing = chartData.outgoing
    $: labels = chartData.labels
    $: color = getColor($activeProfile, $selectedAccount?.id)

    $: {
        if (localize || $selectedAccount) {
            chartData = getAccountActivityData($selectedAccount)
        }
    }
</script>

<div data-label="bar-chart" class="flex flex-col justify-between w-full h-full px-8 pt-6 pb-4">
    <Text type="h5" classes="mb-4">{localize('charts.accountActivity')}</Text>
    <Chart type="bar" {labels} datasets={[incoming, outgoing]} {color} formatYAxis={(value) => value.toFixed(2)} />
</div>
