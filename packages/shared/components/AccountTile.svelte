<script lang="typescript">
    import { Text } from 'shared/components'

    export let onClick = () => ''
    export let name = ''
    export let balance = ''
    export let balanceEquiv = ''
    export let color = 'turquoise'
    export let size = 's'
</script>

<style type="text/scss">
    button {
        height: auto;
        min-height: 110px;
        &.size-m,
        &.size-l {
            height: 70%;
            max-height: 140px;
        }
    }
</style>

<button
    on:click={onClick}
    class="size-{size} group rounded-2xl bg-gray-200 dark:bg-gray-900 hover:bg-{color}-500 font-400 flex flex-col justify-between text-left p-{size === 's' ? '3' : '6'}">
    <Text smaller={size === 's'} overrideColor classes="mb-2 text-gray-800 dark:text-white group-hover:text-white">{name}</Text>
    <div class="flex flex-row justify-between w-full flex-{size === 'l' ? 'nowrap' : 'wrap'}">
        <Text
            smaller={size === 's'}
            overrideColor
            classes="block text-gray-800 dark:text-white group-hover:text-white group-hover:font-700 mr-4">
            {balance}
        </Text>
        <Text smaller={size === 's'} overrideColor classes="block text-blue-500 dark:text-gray-600 group-hover:text-white">
            {balanceEquiv}
        </Text>
    </div>
</button>
