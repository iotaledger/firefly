<script lang="typescript">
    import { Chart, Text } from 'shared/components'
    import { getAccountActivityData } from 'shared/lib/chart'
    import { localize } from '@core/i18n'
    import { selectedAccountStore } from 'shared/lib/wallet'

    let chartData = {
        incoming: {},
        outgoing: {},
        labels: [],
    }
    $: incoming = chartData.incoming
    $: outgoing = chartData.outgoing
    $: labels = chartData.labels

    $: {
        if (localize || $selectedAccountStore) {
            chartData = getAccountActivityData($selectedAccountStore)
        }
    }
</script>

<div data-label="bar-chart" class="flex flex-col justify-between w-full h-full p-6 pb-4">
    <Text type="h5" classes="mb-4">{localize('charts.accountActivity')}</Text>
    <Chart type="bar" {labels} datasets={[incoming, outgoing]} formatYAxis={(value) => value.toFixed(2)} />
</div>
