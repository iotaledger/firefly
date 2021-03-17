<script lang="typescript">
    import { Button, Illustration, OnboardingLayout, Spinner, Text, TransactionItem } from 'shared/components'
    import { createEventDispatcher, onDestroy } from 'svelte'

    export let locale
    export let mobile

    let loading,
        finished = false
    let migratingFundsMessage = ''
    let timeouts = []

    // TODO: dummy
    let transactions = Array.from({ length: 5 }, (_, index) => {
        let balance = Math.floor(Math.random() * 4000000)
        return {
            name: locale('views.transferFragmentedFunds.transaction', { values: { number: index + 1 } }),
            balance,
            status: 0,
            errorText: null,
        }
    })

    const dispatch = createEventDispatcher()

    function handleBackClick() {
        dispatch('previous')
    }
    function handleContinueClick() {
        dispatch('next')
    }

    //TODO:
    function migrateFunds() {
        transactions = transactions.map((item) => ({ ...item, status: 1 }))
        loading = true
        migratingFundsMessage = locale('views.migrate.migrating')
        //TODO: dummy status updates
        timeouts.push(
            setTimeout(() => {
                transactions[0].status = 2
                transactions[1].status = 2
            }, 2000)
        )
        timeouts.push(
            setTimeout(() => {
                transactions[2].status = -1
                transactions[2].errorText = 'Reasons why it failed'
            }, 3000)
        )
        timeouts.push(
            setTimeout(() => {
                transactions[3].status = 2
                transactions[4].status = 2
                loading = false
                finished = true
                migratingFundsMessage = locale('actions.continue')
            }, 3500)
        )
    }

    onDestroy(() => {
        timeouts.forEach((t) => clearTimeout(t))
    })
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <OnboardingLayout onBackClick={handleBackClick} class="">
        <div slot="leftpane__content">
            <Text type="h1" classes="mb-5 mt-5">{locale('views.migrate.title')}</Text>
            <Text type="p" secondary classes="mb-6">{locale('views.transferFragmentedFunds.body1')}</Text>
            <div class="overflow-y-auto h-80 pr-5 pb-6">
                {#each transactions as transaction}
                    <TransactionItem {...transaction} {locale} />
                {/each}
            </div>
        </div>
        <div slot="leftpane__action" class="flex flex-col items-center space-x-4">
            {#if !finished}
                <Button disabled={loading} classes="w-full py-3 mt-2 text-white" onClick={() => migrateFunds()}>
                    <Spinner busy={loading} message={migratingFundsMessage} classes="justify-center" />
                    {#if !loading && !finished}{locale('views.transferFragmentedFunds.migrate')}{/if}
                </Button>
            {:else}
                <Button classes="w-full py-3 mt-2" onClick={() => handleContinueClick()}>{locale('actions.continue')}</Button>
            {/if}
        </div>
        <div slot="rightpane" class="h-full flex">
            <Illustration illustration="migrate-desktop" height="100%" width="auto" classes="h-full object-cover object-left" />
        </div>
    </OnboardingLayout>
{/if}
