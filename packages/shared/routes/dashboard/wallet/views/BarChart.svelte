<script lang="typescript">
    import { Chart, Text } from 'shared/components'
    import { getAccountActivityData } from 'shared/lib/chart'
    import type { WalletAccount } from 'shared/lib/wallet'
    import { getContext } from 'svelte'
    import type { Readable } from 'svelte/store'

    export let locale

    const selectedAccount = getContext<Readable<WalletAccount>>('selectedAccount')

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

<div data-label="bar-chart" class="flex flex-col justify-between w-full h-full px-8 pt-6 pb-4">
    <Text type="h5" classes="mb-4">{locale('charts.accountActivity')}</Text>
    <Chart type="bar" {labels} datasets={[incoming, outgoing]} {color} formatYAxis={(value) => value.toFixed(2)} />
</div>
