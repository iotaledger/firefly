<script lang="typescript">
    import { Button, Illustration, OnboardingLayout, Spinner, Text, TransactionItem } from 'shared/components'
    import { createEventDispatcher, onDestroy } from 'svelte'

    export let locale
    export let mobile

    let busy = false
    let migrated = false
    let fullSuccess = false
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
    function handleRerunClick() {
        migrateFunds()
    }

    //TODO:
    function migrateFunds() {
        transactions = transactions.map((item) => ({ ...item, status: 1 }))
        busy = true
        migrated = false
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
                busy = false
                migrated = true
                migratingFundsMessage = locale('actions.continue')
            }, 3500)
        )
        fullSuccess = false
    }

    onDestroy(() => {
        timeouts.forEach((t) => clearTimeout(t))
    })
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <OnboardingLayout onBackClick={handleBackClick} class="">
        <div slot="leftpane__content" class="h-full flex flex-col flex-wrap">
            <Text type="h2" classes="mb-5">{locale('views.migrate.title')}</Text>
            <Text type="p" secondary classes="mb-6">{locale('views.transferFragmentedFunds.body1')}</Text>
            <div class="flex-auto overflow-y-auto h-1 space-y-4 w-full -mr-2 pr-2">
                {#each transactions as transaction}
                    <TransactionItem {...transaction} {locale} />
                {/each}
            </div>
        </div>
        <div slot="leftpane__action" class="flex flex-col items-center space-y-4">
            {#if !migrated}
                <Button disabled={busy} classes="w-full py-3 mt-2 text-white" onClick={() => migrateFunds()}>
                    <Spinner {busy} message={migratingFundsMessage} classes="justify-center" />
                    {#if !busy && !migrated}{locale('views.transferFragmentedFunds.migrate')}{/if}
                </Button>
            {:else if fullSuccess}
                <Button classes="w-full py-3 mt-2" onClick={() => handleContinueClick()}>{locale('actions.continue')}</Button>
            {:else}
                <Button classes="w-full py-3 mt-2" onClick={() => handleRerunClick()}>
                    {locale('views.transferFragmentedFunds.rerun')}
                </Button>
                <Button secondary classes="w-full py-3 mt-2" onClick={() => handleContinueClick()}>
                    {locale('actions.proceedAnyway')}
                </Button>
            {/if}
        </div>
        <div slot="rightpane" class="w-full h-full flex justify-center bg-pastel-blue dark:bg-gray-900">
            <Illustration illustration="migrate-desktop" height="100%" width="auto" />
        </div>
    </OnboardingLayout>
{/if}
