<script lang="typescript">
    import { Text } from 'shared/components'

    export let onClick = () => ''
    export let name = ''
    export let balance = ''
    export let balanceEquiv = ''
    export let color = 'turquoise'
    export let size = 's'
    export let deleted = false
</script>

<style type="text/scss">
    button {
        height: auto;
        min-height: 90px;
        max-height: 110px;
        &.size-m,
        &.size-l {
            min-height: 140px;
            max-height: 140px;
            height: 70%;
        }
    }
</style>

<button
    on:click={onClick}
    class="size-{size} group rounded-xl bg-gray-100 dark:bg-gray-900 hover:bg-{color}-500 font-400 flex flex-col justify-between text-left p-{size === 's' ? '3' : '6'} {deleted ? 'opacity-50' : ''}">
    <div class="w-full">
        <Text
            bold
            smaller={size === 's'}
            overrideColor
            classes="mb-2 text-gray-800 dark:text-white group-hover:text-white overflow-hidden overflow-ellipsis">
            {name}
        </Text>
    </div>
    <div
        class="flex {size === 'l' ? 'flex-row space-x-4' : 'flex-col space-y-1'} justify-between w-full flex-{size === 'l' ? 'nowrap' : 'wrap'}">
        <Text smaller overrideColor classes="block text-gray-800 dark:text-white group-hover:text-white">{balance}</Text>
        <Text smaller overrideColor classes="block text-blue-500 dark:text-gray-600 group-hover:text-white">{balanceEquiv}</Text>
    </div>
</button>
