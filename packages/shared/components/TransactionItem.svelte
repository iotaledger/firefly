<script lang="typescript">
    import { Icon } from 'shared/components'
    import Text from './Text.svelte';
    export let name = ''
    export let amount = ''
    let selected = false

    function selectItem(){
        selected = selected === true ? false : true;
    }
</script>
<style type="text/scss">
	.selected {
        @apply border-blue-500;
        @apply border-2;
	}
</style>

<div class="transaction-item flex justify-between border-solid border border-gray-200 rounded-2xl h-14 items-center px-6 cursor-pointer focus:border-blue-500 mt-4"
class:selected="{selected === true}"
on:click="{() => selectItem()}">
    <div class="flex items-center">
        <Icon icon="chevron-right" classes="right text-blue-500" />
        <Text type="p" smaller classes="ml-4">{name}</Text>
    </div>
    <Text type="p" secondary smaller classes="text-gray-500">{amount}</Text>
</div>

