<script>
    import { Text } from 'shared/components'

    export let onClick = () => ''
    export let name = ''
    export let balance = ''
    export let balanceEquiv = ''
    export let color = 'turquoise'
    export let width = 'full'
</script>

<button
    on:click={onClick}
    class={`group rounded-2xl bg-gray-200 dark:bg-gray-900 hover:bg-${color}-500 flex-col justify-between text-left -mx-2 mb-2 p-3 w-${width}`}>
    <Text type="p" smaller overrideColor classes="mb-6 text-gray-800 dark:text-white group-hover:text-white">{name}</Text>
    <div class="flex flex-wrap justify-between -mx-4">
        <Text
            type="p"
            smaller
            overrideColor
            classes="text-gray-800 dark:text-white group-hover:text-white group-hover:font-700 px-4">
            {balance}
        </Text>
        <Text type="p" smaller overrideColor classes="text-blue-500 dark:text-gray-600 group-hover:text-white px-4">
            {balanceEquiv}
        </Text>
    </div>
</button>
