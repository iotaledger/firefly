<script lang="typescript">
    import { Icon, Tooltip } from 'shared/components'
    import Text from './Text.svelte';
	import { onMount } from 'svelte';
    import { formatUnit } from 'shared/lib/units'

    export let locale
    export let name = ''
    export let rawBalance = 0
    export let humanReadableBalance = ''
    export let fiatbalance = 0
    export let selected = false
    export let error = 0
	export let showRiskLevel = false
    export let riskLevel = -1
    //risk level possible values
    //0: very low
    //1: low
    //2: medium
    //3: high
    //4: very high

	let showTooltip = false

	function toggleShow() {
		showTooltip = !showTooltip
	}

	onMount(() => {
		if(rawBalance < 1000000) error = 1
        humanReadableBalance = formatUnit(rawBalance)
	});

    function selectAddress(){
        if(error != 1) selected = !selected
    }
</script>

<style type="text/scss">
	.selected {
		@apply border-2;
		@apply border-blue-500;
	}
    .riskBars div {
        @apply h-4;
        @apply w-1;
        @apply bg-gray-300;
        @apply rounded-2xl;
    }
    .riskBars .veryLowRisk{
        @apply bg-green-400;
    }
    .riskBars .lowRisk{
        @apply bg-green-500;
    }
    .riskBars .mediumRisk{
        @apply bg-yellow-500;
    } 
    .riskBars .highRisk{
        @apply bg-orange-500;
    } 
    .riskBars .veryHighRisk{
        @apply bg-red-500;
    }         
</style>

<div class="transaction-item relative flex justify-between border-solid border border-gray-200 rounded-2xl h-14 items-center pl-5 pr-6 focus:border-blue-500 mt-4
{error != 1 ? 'cursor-pointer' : ''} {selected === true ? 'selected' : ''}" on:click="{() => selectAddress()}">
    {#if showTooltip}<Tooltip classes="leftside" text={locale('views.secureSpentAddresses.error')}/>{/if}
    <div class="flex items-center justify-between w-full">
        <div class="flex items-center">
            {#if error === 1}    
                <div class="w-6 h-6 bg-gray-100 rounded-full border border-solid border-gray-300 ml-3"/>
            {:else}
                <Icon icon=status_success classes="text-white bg-blue-500 rounded-full ml-3"/>
            {/if}
                <div class="ml-4">
                    {#if error === 1}    
                        <Text type="p" smaller secondary>{name}</Text>
                    {:else}
                        <Text type="p" smaller >{name}</Text>
                    {/if}
                    <Text type="p" secondary smaller classes="text-gray-500 mt-1" >
                        {humanReadableBalance}
                        <span class="mx-1">·</span>
                        <span class="uppercase">{fiatbalance}</span>
                    </Text>
                </div>
        </div>
        {#if error === 1 && riskLevel == -1}    
            <div class="flex items-center relative">
                {#if error === 1}
                    <div class="flex items-center relative" on:mouseenter={toggleShow} on:mouseleave={toggleShow} >
                        <Icon icon=info classes="text-red-500 bg-white rounded-full ml-3"/>
                    </div>
                {/if}
            </div>
        {:else}  
            <div class="riskBars flex justify-between w-8">
                {#if riskLevel === 0}
                    <div class="veryLowRisk"/><div/><div/><div/><div/>
                {:else if riskLevel === 1}  
                    <div class="lowRisk"/><div class="lowRisk"/><div/><div/><div/>
                {:else if riskLevel === 2}  
                    <div class="mediumRisk"/><div class="mediumRisk"/><div class="mediumRisk"/><div/><div/>
                {:else if riskLevel === 3}  
                    <div class="highRisk" /><div class="highRisk" /><div class="highRisk" /><div class="highRisk" /><div/>
                {:else if riskLevel === 4}  
                    <div class="veryHighRisk" /> <div class="veryHighRisk" /> <div class="veryHighRisk" /> <div class="veryHighRisk" /> <div class="veryHighRisk" />
                {/if}
            </div>
        {/if}
    </div>
</div>