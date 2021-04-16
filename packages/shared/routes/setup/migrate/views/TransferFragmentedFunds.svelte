<script lang="typescript">
    import { Button, Illustration, OnboardingLayout, Spinner, Text, TransactionItem } from 'shared/components'
    import { createEventDispatcher, onDestroy } from 'svelte'
    import {
        migration,
        getInputIndexesForBundle,
        createMigrationBundle,
        sendMigrationBundle,
        unmigratedBundles,
        selectedUnmigratedBundles,
        hasMigratedAnyBundle,
        confirmedBundles,
        hasMigratedAndConfirmedAllSelectedBundles,
    } from 'shared/lib/migration'
    import { showAppNotification } from 'shared/lib/notifications'
    import { newProfile, profileInProgress, saveProfile, setActiveProfile } from 'shared/lib/profile'

    export let locale
    export let mobile

    let busy = false
    let migrated = false
    let migratingFundsMessage = ''
    let fullSuccess = $hasMigratedAndConfirmedAllSelectedBundles

    const { didComplete } = $migration

    let transactions = $selectedUnmigratedBundles.map((_bundle, index) => ({
        ..._bundle,
        name: locale('views.transferFragmentedFunds.transaction', { values: { number: index + 1 } }),
        balance: _bundle.inputs.reduce((acc, input) => acc + input.balance, 0),
        status: 0,
        errorText: null,
    }))

    const unsubscribe = hasMigratedAndConfirmedAllSelectedBundles.subscribe((_hasMigratedAndConfirmedAllSelectedBundles) => {
        fullSuccess = _hasMigratedAndConfirmedAllSelectedBundles

        migrated = _hasMigratedAndConfirmedAllSelectedBundles

        if (_hasMigratedAndConfirmedAllSelectedBundles) {
            migratingFundsMessage = locale('actions.continue')
            busy = false
        }
    })

    let migratedAndUnconfirmedBundles = []

    confirmedBundles.subscribe((newConfirmedBundles) => {
        newConfirmedBundles.forEach((bundle) => {
            if (bundle.bundleHash && bundle.confirmed) {
                const hadMigratedAndUnconfirmedBundles = migratedAndUnconfirmedBundles.length > 0
                migratedAndUnconfirmedBundles = migratedAndUnconfirmedBundles.filter(
                    (bundleHash) => bundleHash !== bundle.bundleHash
                )

                if (hadMigratedAndUnconfirmedBundles && migratedAndUnconfirmedBundles.length === 0) {
                    migrated = true
                    busy = false
                }

                transactions = transactions.map((item) => {
                    if (item.bundleHash === bundle.bundleHash) {
                        return { ...item, status: 2 }
                    }

                    return item
                })
            }
        })
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
                return { ...item, status: 1, errorText: null }
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
                            return sendMigrationBundle(transaction.bundleHash).then(() => {
                                migratedAndUnconfirmedBundles = [...migratedAndUnconfirmedBundles, transaction.bundleHash]
                            })
                        }

                        return createMigrationBundle(getInputIndexesForBundle(transaction), 0, false).then((result) => {
                            transactions = transactions.map((_transaction) => {
                                if (_transaction.index === transaction.index) {
                                    return { ..._transaction, bundleHash: result.payload.bundleHash }
                                }

                                return _transaction
                            })

                            return sendMigrationBundle(result.payload.bundleHash).then(() => {
                                migratedAndUnconfirmedBundles = [...migratedAndUnconfirmedBundles, result.payload.bundleHash]
                            })
                        })
                    })
                    .catch((error) => {
                        console.error(error)
                        showAppNotification({
                            type: 'error',
                            message: locale('views.migrate.error'),
                        })
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
                            return sendMigrationBundle(transaction.bundleHash).then(() => {
                                migratedAndUnconfirmedBundles = [...migratedAndUnconfirmedBundles, transaction.bundleHash]
                            })
                        }

                        return createMigrationBundle(getInputIndexesForBundle(transaction), 0, false).then((result) => {
                            transactions = transactions.map((_transaction, i) => {
                                if (_transaction.index === transaction.index) {
                                    return { ..._transaction, bundleHash: result.payload.bundleHash }
                                }

                                return _transaction
                            })

                            return sendMigrationBundle(result.payload.bundleHash).then(() => {
                                if (idx === 0) {
                                    // When the first migration bundle is broadcast, then persist profile
                                    saveProfile($newProfile)
                                    setActiveProfile($newProfile.id)

                                    profileInProgress.set(undefined)
                                    newProfile.set(null)
                                }

                                migratedAndUnconfirmedBundles = [...migratedAndUnconfirmedBundles, result.payload.bundleHash]
                            })
                        })
                    })

                    .catch((error) => {
                        console.error(error)
                        showAppNotification({
                            type: 'error',
                            message: locale('views.migrate.error'),
                        })
                        transactions = transactions.map((_transaction, i) => {
                            if (_transaction.index === transaction.index) {
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
    <OnboardingLayout allowBack={!$hasMigratedAnyBundle} onBackClick={handleBackClick} class="">
        <div slot="leftpane__content" class="h-full flex flex-col flex-wrap">
            <Text type="h2" classes="mb-5">{locale('views.migrate.title')}</Text>
            <Text type="p" secondary classes="mb-4">{locale('views.transferFragmentedFunds.body1')}</Text>
            <div class="flex-auto overflow-y-auto h-1 space-y-4 w-full scrollable-y scroll-secondary">
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
            {/if}
        </div>
        <div slot="rightpane" class="w-full h-full flex justify-center bg-pastel-blue dark:bg-gray-900">
            <Illustration illustration="migrate-desktop" height="100%" width="auto" />
        </div>
    </OnboardingLayout>
{/if}
