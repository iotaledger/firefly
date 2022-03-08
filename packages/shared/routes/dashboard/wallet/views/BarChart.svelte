<script lang="typescript">
    import { Chart, Text } from 'shared/components'
    import { getAccountActivityData } from 'shared/lib/chart'
    import { getContext } from 'svelte'
    import { Readable } from 'svelte/store'
    import { Locale } from 'shared/lib/typings/i18n'
    import { WalletAccount } from 'shared/lib/typings/wallet'
    import { activeProfile, getColor } from 'shared/lib/profile'

    export let locale: Locale

    const selectedAccount = getContext<Readable<WalletAccount>>('selectedAccount')

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
        if (locale || $selectedAccount) {
            chartData = getAccountActivityData($selectedAccount)
        }
    }
</script>

<div data-label="bar-chart" class="flex flex-col justify-between w-full h-full px-8 pt-6 pb-4">
    <Text type="h5" classes="mb-4">{locale('charts.accountActivity')}</Text>
    <Chart type="bar" {labels} datasets={[incoming, outgoing]} {color} formatYAxis={(value) => value.toFixed(2)} />
</div>
