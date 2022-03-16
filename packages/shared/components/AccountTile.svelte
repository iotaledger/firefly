<script lang="typescript">
    import { Text } from 'shared/components'
    import { isBright } from 'shared/lib/helpers'

    export let name = ''
    export let balance = ''
    export let balanceEquiv = ''
    export let color = ''
    export let classes = ''

    $: textColor = isBright(color) ? 'gray-800' : 'white'
</script>

<div
    class="account-tile p-6 rounded-xl font-400 flex flex-col justify-between text-left {classes}"
    style="--account-color: {color};"
>
    <div class="mb-2 w-full flex flex-row justify-between items-start space-x-1.5">
        <div class="flex flex-row space-x-1.5 items-start w-full whitespace-nowrap">
            <Text bold overrideColor classes="inline text-{textColor} overflow-hidden overflow-ellipsis">{name}</Text>
        </div>
    </div>
    <div class="flex flex-col space-y-1 justify-between w-full flex-nowrap">
        <Text smaller overrideColor classes="block text-{textColor}">{balance}</Text>
        <Text smaller overrideColor classes="block text-{textColor}">{balanceEquiv}</Text>
    </div>
</div>

<style type="text/scss">
    .account-tile {
        background-color: var(--account-color);
        height: auto;
        min-height: 140px;
        max-height: 100%;
    }
</style>
