<script lang="typescript">
    import { createEventDispatcher } from 'svelte'
    import { Button, Illustration, OnboardingLayout, Spinner, Text, TransactionItem } from 'shared/components'

    export let locale
    export let mobile

    let loading, finished = false
    let migratingFundsMessage = ""

    //TODO: Retrieve transactions
	let transactions = [
        {
            id: 0,
            name: locale('views.transferFragmentedFunds.transaction'),
            amount: '4.63 i',
            status: 0,
            errorText: "this is the error message"
        },
        {
            id: 1,
            name: locale('views.transferFragmentedFunds.transaction'),
            amount: '458.52 Mi',
            status: 0,
            errorText: "this is the error message"
        }, 
        {
            id: 2,
            name: locale('views.transferFragmentedFunds.transaction'),
            amount: '4.63 i',
            status: 0,
            errorText: "this is the error message"
        },
        {
            id: 3,
            name: locale('views.transferFragmentedFunds.transaction'),
            amount: '28.52 Mi',
            status: 0,
            errorText: "this is the error message"
        },
        {
            id: 4,
            name: locale('views.transferFragmentedFunds.transaction'),
            amount: '8.52 Gi',
            status: 0,
            errorText: "this is the error message"
        },                               
    ]

    const dispatch = createEventDispatcher()

    function handleBackClick() {
        dispatch('previous')
    }
    function handleContinueClick(){
        console.log("next screen")
    }
    //TODO:
    function migrateFunds(){
        transactions = transactions.map((item) => ({...item, status:1}))
        loading = true
        migratingFundsMessage = locale('views.migrate.migrating')
        //TODO: dummy status updates
        setTimeout(() => {
            transactions[0].status  = 2
            transactions[1].status  = 2
        }, 2000)
        setTimeout(() => {
            transactions[2].status  = -1
        }, 3000)
        setTimeout(() => {
            transactions[3].status  = 2
            transactions[4].status  = 2
            loading = false
            finished = true
            migratingFundsMessage = locale('actions.continue')            
        }, 3500)
    }


</script>

{#if mobile}
    <div>foo</div>
{:else}
    <OnboardingLayout onBackClick={() => dispatch('previous')} class="">
        <div slot="leftpane__content">
            <Text type="h1" classes="mb-5 mt-5">{locale('views.migrate.title')}</Text>
            <Text type="p" secondary classes="mb-6">{locale('views.transferFragmentedFunds.body1')}</Text>
            {#each transactions as transaction}
                <TransactionItem {...transaction} {locale} />
            {/each}
        </div>
        <div slot="leftpane__action" class="flex flex-col items-center space-x-4">
            {#if !finished}
                <Button
                disabled={loading}
                classes="w-full py-3 mt-2 text-white" onClick={() => migrateFunds()}>
                    <Spinner busy={loading} message={migratingFundsMessage} classes="justify-center" />
                    {#if !loading && !finished}
                        {locale('views.transferFragmentedFunds.migrate')}
                    {/if}
                </Button>
            {:else}
                <Button classes="w-full py-3 mt-2" onClick={() => handleContinueClick()}>
                    {locale('actions.continue')}
                </Button>
            {/if}
        </div>
        <div slot="rightpane" class="h-full flex">
            <Illustration illustration="migrate-desktop" height="100%" width="auto" classes="h-full object-cover object-left" />
        </div>
    </OnboardingLayout>
{/if}


