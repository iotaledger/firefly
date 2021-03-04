<script lang="typescript">
    import { Chart, Text } from 'shared/components'
    import { getAccountActivityData } from 'shared/lib/chart'
    import { getContext } from 'svelte'

    export let locale

    const selectedAccount = getContext('selectedAccount')

    let chartData = {
        incoming: {},
        outgoing: {},
        labels: [],
    }
    $: incoming = chartData.incoming
    $: outgoing = chartData.outgoing
    $: labels = chartData.labels
    $: color = $selectedAccount ? $selectedAccount.color : 'blue'

    $: {
        if (locale || $selectedAccount) {
            chartData = getAccountActivityData($selectedAccount)
        }
    }
</script>

<div data-label="portfolio-token-chart" class="w-full h-full px-8 py-4">
    <Text type="h4" classes="mb-4">{locale('charts.account_activity')}</Text>
    <div class="flex-auto">
        <Chart type="bar" {labels} datasets={[incoming, outgoing]} {color} />
    </div>
</div>
