<script lang="typescript">
    import { getContext } from 'svelte'
    import { getAccountActivity } from 'shared/lib/wallet'
    import { Chart, Text } from 'shared/components'

    export let locale

    const selectedAccount = getContext('selectedAccount')

    $: data = getAccountActivity($selectedAccount)
    $: labels = data.map((data) => data.timestamp)
    $: color = $selectedAccount ? $selectedAccount.color : 'blue'
</script>

<div data-label="portfolio-token-chart" class="w-full h-full px-8 py-4">
    <Text type="h4" classes="mb-4">{locale('general.account_activity')}</Text>
    <div class="flex-auto">
        <Chart type="bar" {labels} {data} {color} />
    </div>
</div>
