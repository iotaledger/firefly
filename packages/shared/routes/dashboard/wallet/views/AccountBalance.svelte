<script lang="typescript">
    import { Text } from 'shared/components'

    export let locale
    export let color
    export let balance
    export let balanceEquiv
</script>

<div class="bg-gradient-to-b from-{color}-500 to-{color}-600 dark:from-gray-800 dark:to-gray-900 pt-7 pb-10 px-8">
    <!-- Balance -->
    <div data-label="total-balance">
        <Text type="p" overrideColor smaller classes="text-white mb-2">{locale('general.total_balance')}</Text>
        <Text type="h2" overrideColor classes="text-white mb-2">{balance}</Text>
        <Text type="p" overrideColor smaller classes="text-white dar:text-blue-300 text-opacity-70 ">{balanceEquiv}</Text>
    </div>
</div>
