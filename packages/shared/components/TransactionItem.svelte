<script lang="typescript">
    import { Icon, Tooltip } from 'shared/components'
    import Text from './Text.svelte';
    export let locale
    export let id = 0
    export let name = ''
    export let amount = ''
    export let status = 0
    //status possible values
    //0: ready to migrate
    //1: migrating
    //2: success
    //-1: error
    export let errorText = ""

	let showTooltip = false
	function toggleShow() {
		showTooltip = !showTooltip
	}

</script>
<style type="text/scss">
	.selected {
        @apply border-blue-500;
        @apply border-2;
	}
</style>

<div class="transaction-item flex justify-between border-solid border border-gray-200 rounded-2xl h-14 items-center pl-5 pr-6 focus:border-blue-500 mt-4">
    <div class="flex items-center justify-between w-full">
        <div class="flex items-center">
            <Icon icon="double-chevron-right" classes="right text-blue-500" />
            <Text type="p" smaller classes="ml-4">{name}<span class="ml-1">{id}</span></Text>
        </div>
        <div class="flex items-center relative">
            {#if status === 0}
                <Text type="p" secondary smaller classes="text-gray-500">{amount}</Text>
            {:else if status === 1 }        
                <Text type="p" secondary smaller>{locale('views.migrate.migrating')}</Text>
            {:else if status === -1}
                <div class="flex items-center relative" on:mouseenter={toggleShow} on:mouseleave={toggleShow} >
                    {#if showTooltip}<Tooltip text={errorText} />{/if}
                    <Text type="p" secondary smaller>{locale('views.migrate.migrationFailed')}</Text>
                    <Icon icon=status_error classes="text-white bg-red-500 rounded-full ml-3"/>
                </div>
            {:else if status === 2}
                <Text type="p" secondary smaller classes="text-gray-500">{amount}</Text>
                <Text type="p" secondary smaller classes="ml-1">{locale('views.migrate.migrated')}</Text>
                <Icon icon=status_success classes="text-white bg-green-600 rounded-full ml-3"/>
            {/if}
        </div>
    </div>
</div>











