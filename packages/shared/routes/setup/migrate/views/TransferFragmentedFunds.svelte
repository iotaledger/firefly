<script lang="typescript">
    import { Button, Illustration, OnboardingLayout, Spinner, Text, TransactionItem } from 'shared/components'
    import { createEventDispatcher, onDestroy } from 'svelte'
    import {
        migration,
        getInputIndexesForBundle,
        createMigrationBundle,
        sendMigrationBundle,
        unmigratedBundles,
        hasMigratedAllSelectedBundles,
        selectedUnmigratedBundles,
    } from 'shared/lib/migration'

    export let locale
    export let mobile

    let busy = false
    let migrated = false
    let migratingFundsMessage = ''
    let fullSuccess = $hasMigratedAllSelectedBundles

    const { didComplete } = $migration

    let transactions = $selectedUnmigratedBundles.map((_bundle, index) => ({
        ..._bundle,
        name: locale('views.transferFragmentedFunds.transaction', { values: { number: index + 1 } }),
        balance: _bundle.inputs.reduce((acc, input) => acc + input.balance, 0),
        status: 0,
        errorText: null,
    }))

    const unsubscribe = hasMigratedAllSelectedBundles.subscribe((_hasMigratedAllSelectedBundles) => {
        fullSuccess = _hasMigratedAllSelectedBundles
    })

    const dispatch = createEventDispatcher()

    function handleBackClick() {
        if (!busy) {
            dispatch('previous')
        }
    }

    function handleContinueClick() {
        didComplete.set(true)
        dispatch('next')
    }

    function handleRerunClick() {
        const _unmigratedBundles = $unmigratedBundles
        const unmigratedBundleIndexes = _unmigratedBundles.map((_bundle) => _bundle.index)

        // TODO: What happens if this fails too? Do we proceed?
        transactions = transactions.map((item) => {
            if (unmigratedBundleIndexes.includes(item.index)) {
                return { ...item, status: 1 }
            }

            return item
        })

        busy = true
        migrated = false
        migratingFundsMessage = locale('views.migrate.migrating')

        _unmigratedBundles.reduce(
            (promise, transaction, idx) =>
                // @ts-ignore
                promise
                    .then((acc) => {
                        if (transaction.bundleHash) {
                            return sendMigrationBundle(transaction.bundleHash)
                        }

                        return createMigrationBundle(getInputIndexesForBundle(transaction), 0, false).then((result) =>
                            sendMigrationBundle(result.payload.bundleHash)
                        )
                    })
                    .then(() => {
                        transactions = transactions.map((_transaction) => {
                            if (_transaction.index === transaction.index) {
                                return { ..._transaction, status: 2 }
                            }

                            return _transaction
                        })

                        if (idx === _unmigratedBundles.length - 1) {
                            finish()
                        }
                    })
                    .catch((error) => {
                        console.error(error)

                        if (idx === _unmigratedBundles.length - 1) {
                            finish()
                        }

                        transactions = transactions.map((_transaction, i) => {
                            if (_transaction.index === transaction.index) {
                                return { ..._transaction, status: -1, errorText: locale('views.migrate.migrationFailed') }
                            }

                            return _transaction
                        })
                    }),
            Promise.resolve([])
        )
    }

    function finish() {
        busy = false
        migrated = true
        migratingFundsMessage = locale('actions.continue')
    }

    onDestroy(unsubscribe)

    function migrateFunds() {
        // TODO: Rethink if we need to only update status of the transaction we are actually sending
        transactions = transactions.map((item) => ({ ...item, status: 1 }))
        busy = true
        migrated = false
        migratingFundsMessage = locale('views.migrate.migrating')

        transactions.reduce(
            (promise, transaction, idx) =>
                // @ts-ignore
                promise
                    .then((acc) => {
                        if (transaction.bundleHash) {
                            return sendMigrationBundle(transaction.bundleHash)
                        }

                        return createMigrationBundle(getInputIndexesForBundle(transaction), 0, false).then((result) =>
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
