<script lang="typescript">
    import { Button, Illustration, OnboardingLayout, Spinner, Text, TransactionItem } from 'shared/components'
    import { createEventDispatcher, onDestroy } from 'svelte'
    import {
        migration,
        getInputIndexesForBundle,
        createMigrationBundle,
        sendMigrationBundle,
    } from 'shared/lib/migration'

    export let locale
    export let mobile

    let loading,
        finished = false
    let migratingFundsMessage = ''

    const { didComplete, bundles } = $migration

    let transactions = $bundles.map((_bundle, index) => ({
        ..._bundle,
        name: locale('views.transferFragmentedFunds.transaction', { values: { number: index + 1 } }),
        balance: _bundle.inputs.reduce((acc, input) => acc + input.balance, 0),
        status: 0,
        errorText: null,
    }))

    const dispatch = createEventDispatcher()

    function handleBackClick() {
        dispatch('previous')
    }

    function handleContinueClick() {
        didComplete.set(true)
        dispatch('next')
    }

    function finish() {
        loading = false
        finished = true
        migratingFundsMessage = locale('actions.continue')
    }

    function migrateFunds() {
        // TODO: Rethink if we need to only update status of the transaction we are actually sending
        transactions = transactions.map((item) => ({ ...item, status: 1 }))
        loading = true
        migratingFundsMessage = locale('views.migrate.migrating')

        transactions.reduce(
            (promise, transaction, idx) =>
                // @ts-ignore
                promise
                    .then((acc) => {
                        if (transaction.bundleHash) {
                            return sendMigrationBundle(transaction.bundleHash)
                        }

                        return createMigrationBundle(getInputIndexesForBundle(transaction), false).then((result) =>
                            sendMigrationBundle(result.payload.bundleHash)
                        )
                    })
                    .then(() => {
                        transactions = transactions.map((_transaction, i) => {
                            if (i === idx) {
                                return { ..._transaction, status: 2 }
                            }

                            return _transaction
                        })

                        if (idx === transactions.length - 1) {
                            finish()
                        }
                    })
                    .catch((error) => {
                        console.error(error)

                        if (idx === transactions.length - 1) {
                            finish()
                        }

                        transactions = transactions.map((_transaction, i) => {
                            if (i === idx) {
                                return { ..._transaction, status: -1, errorText: 'Migration failed' }
                            }

                            return _transaction
                        })
                    }),
            Promise.resolve([])
        )
    }
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
