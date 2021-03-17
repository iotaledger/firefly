<script lang="typescript">
    import { createEventDispatcher } from 'svelte'
    import { Button, Illustration, OnboardingLayout, Spinner, Text, SpentAddress } from 'shared/components'
    import { AvailableExchangeRates, convertToFiat, currencies, CurrencyTypes, exchangeRates } from 'shared/lib/currency'
    import { formatUnit } from 'shared/lib/units'
    import { get } from 'svelte/store'
    export let locale
    export let mobile

    const dispatch = createEventDispatcher()

    //TODO: Retrieve addresses
    let balance1 = Math.floor(Math.random() * 2000000)
    let balance2 = Math.floor(Math.random() * 2000000)
    let balance3 = Math.floor(Math.random() * 2000000)
    let balance4 = Math.floor(Math.random() * 2000000)
    let balance5 = Math.floor(Math.random() * 2000000)
    let fiatbalance1 = `${convertToFiat(balance1,get(currencies)[CurrencyTypes.USD],get(exchangeRates)[AvailableExchangeRates.USD])} ${CurrencyTypes.USD}`        
    let fiatbalance2 = `${convertToFiat(balance2,get(currencies)[CurrencyTypes.USD],get(exchangeRates)[AvailableExchangeRates.USD])} ${CurrencyTypes.USD}`        
    let fiatbalance3 = `${convertToFiat(balance3,get(currencies)[CurrencyTypes.USD],get(exchangeRates)[AvailableExchangeRates.USD])} ${CurrencyTypes.USD}`        
    let fiatbalance4 = `${convertToFiat(balance4,get(currencies)[CurrencyTypes.USD],get(exchangeRates)[AvailableExchangeRates.USD])} ${CurrencyTypes.USD}`        
    let fiatbalance5 = `${convertToFiat(balance5,get(currencies)[CurrencyTypes.USD],get(exchangeRates)[AvailableExchangeRates.USD])} ${CurrencyTypes.USD}`        
	let addresses = [
        {
            name: 'iot1q9f0k...tzl2fcp98',
            rawBalance: balance1,
            fiatbalance: fiatbalance1,
            riskLevel: 2
        },
        {
            name: 'iot1q9f0k...tzl2fcp98',
            rawBalance: balance2,
            fiatbalance: fiatbalance2,
            riskLevel: 0
        }, 
        {
            name: 'iot1q9f0k...tzl2fcp98',
            rawBalance: balance3,
            fiatbalance: fiatbalance3,
            riskLevel: 1
        },
        {
            name: 'iot1q9f0k...tzl2fcp98',
            rawBalance: balance4,
            fiatbalance: fiatbalance4,
            riskLevel: 4
        },
        {
            name: 'iot1q9f0k...tzl2fcp98',
            rawBalance: balance5,
            fiatbalance: fiatbalance5,
            riskLevel: 3
        },                               
    ]

    function handleBackClick() {
        dispatch('previous')
    }
    function handleContinueClick(){
        console.log("go to next screen")
    }
    function rerunProcess() {
        console.log("rerun clicked")
    }

</script>

<style type="text/scss">
    .scrollable{
        overflow-x: hidden;
        overflow-y: auto;
    }
    *::-webkit-scrollbar {
        @apply w-1;
    }
    *::-webkit-scrollbar-track {
        @apply bg-gray-100;
        background-clip: content-box; 
        border: 14px solid transparent;
    }
    *::-webkit-scrollbar-thumb {
        @apply bg-gray-300;
        border-radius: 20px;
    }
</style>


{#if mobile}
    <div>foo</div>
{:else}
    <OnboardingLayout onBackClick={() => dispatch('previous')}>
        <div slot="leftpane__content">
            <Text type="h2" classes="mb-5 mt-5">{locale('views.securityCheckCompleted.title')}</Text>
            <Text type="p" secondary classes="mb-6">{locale('views.securityCheckCompleted.body1')}</Text>
            <div class="scrollable h-80 pr-5 pb-6">
                {#each addresses as address}
                    <SpentAddress {...address} {locale} showRiskLevel/>
                {/each}
            </div>
        </div>
        <div slot="leftpane__action" class="flex flex-col items-center">
            <Button secondary classes="w-full py-3 mt-2" onClick={() => rerunProcess()}>
                {locale('views.securityCheckCompleted.rerun')}
            </Button>
            <Button classes="w-full py-3 mt-4" onClick={() => handleContinueClick()}>
                {locale('views.securityCheckCompleted.continueMigration')}
            </Button>
        </div>
        <div slot="rightpane" class="h-full flex">
            <Illustration illustration="migrate-desktop" height="100%" width="auto" classes="h-full object-cover object-left" />
        </div>
    </OnboardingLayout>
{/if}


