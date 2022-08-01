<script lang="typescript">
    import { createEventDispatcher, onDestroy } from 'svelte'
    import { get } from 'svelte/store'
    import { Animation, Button, OnboardingLayout, Spinner, Text, TransactionItem } from 'shared/components'
    import { mobile } from '@core/app'
    import { localize } from '@core/i18n'
    import { addNewProfile, loadPersistedProfileIntoActiveProfile, login } from '@core/profile'
    import { newProfile } from '@contexts/onboarding'
    import { displayNotificationForLedgerProfile, ledgerDeviceState, promptUserToConnectLedger } from '@lib/ledger'
    import {
        ADDRESS_SECURITY_LEVEL,
        confirmedBundles,
        createLedgerMigrationBundle,
        createMinedLedgerMigrationBundle,
        hardwareIndexes,
        hasMigratedAndConfirmedAllSelectedBundles,
        hasMigratedAnyBundle,
        unmigratedBundles,
    } from '@lib/migration'
    import { Platform } from '@lib/platform'
    import { closePopup, popupState } from '@lib/popup'
    import { LedgerAppName, LedgerDeviceState } from '@lib/typings/ledger'
    import { ProfileRecoveryType, profileRecoveryType } from '@contexts/onboarding'

    let busy = false
    let migrated = false
    let migratingFundsMessage = ''
    let fullSuccess = $hasMigratedAndConfirmedAllSelectedBundles

    const dispatch = createEventDispatcher()
    const legacyLedger = $profileRecoveryType === ProfileRecoveryType.TrinityLedger

    let closeTransport = () => {}
    let hasBroadcastAnyBundle = false
    let transactions = get(unmigratedBundles).map((_bundle, index) => ({
        ..._bundle,
        name: localize('views.transferFragmentedFunds.transaction', { values: { number: index + 1 } }),
        balance: _bundle.inputs.reduce((acc, input) => acc + input.balance, 0),
        status: 0,
        errorText: null,
    }))
    let migratedAndUnconfirmedBundles = []

    $: animation = legacyLedger ? 'ledger-migrate-desktop' : 'migrate-desktop'

    $: if (
        legacyLedger &&
        busy &&
        $ledgerDeviceState !== LedgerDeviceState.LegacyConnected &&
        transactions.every((tx) => tx.status !== 1)
    ) {
        migrated = true
        busy = false
    }

    function unsubscribeSelectedBundles(): void {
        hasMigratedAndConfirmedAllSelectedBundles.subscribe((_hasMigratedAndConfirmedAllSelectedBundles) => {
            fullSuccess = _hasMigratedAndConfirmedAllSelectedBundles

            migrated = _hasMigratedAndConfirmedAllSelectedBundles

            if (_hasMigratedAndConfirmedAllSelectedBundles) {
                migratingFundsMessage = localize('actions.continue')
                busy = false
            }
        })
    }

    function unsubscribeConfirmedBundles(): void {
        confirmedBundles.subscribe((newConfirmedBundles) => {
            newConfirmedBundles.forEach((bundle) => {
                if (bundle.bundleHash && bundle.confirmed) {
                    migratedAndUnconfirmedBundles = migratedAndUnconfirmedBundles.filter(
                        (bundleHash) => bundleHash !== bundle.bundleHash
                    )

                    transactions = transactions.map((item) => {
                        if (item.bundleHash === bundle.bundleHash) {
                            return { ...item, status: 2 }
                        }

                        return item
                    })
                }
            })
        })
    }

    function handleBackClick(): void {
        if (!busy) {
            dispatch('previous')
        }
    }

    function handleContinueClick(): void {
        didComplete.set(true)
        dispatch('next')
    }

    function handleRerunClick(): void {
        if (legacyLedger) {
            const _onConnected = () => rerunMigration()
            promptUserToConnectLedger(true, _onConnected)
        } else {
            rerunMigration()
        }
    }

    function setMigratingTransaction(transaction, status): void {
        busy = true
        migrated = false
        transactions = transactions.map((_transaction) => {
            if (_transaction.index === transaction.index) {
                return { ..._transaction, status }
            }

            return _transaction
        })
    }

    function rerunMigration(): void {
        const _unmigratedBundles = $unmigratedBundles
        const unmigratedBundleIndexes = _unmigratedBundles.map((_bundle) => _bundle.index)

        transactions = transactions.map((item) => {
            if (unmigratedBundleIndexes.includes(item.index)) {
                return { ...item, status: 0, errorText: null }
            }

            return item
        })
        migratingFundsMessage = localize('views.migrate.migrating')

        _unmigratedBundles.reduce(
            (promise, transaction, idx) =>
                // @ts-ignore
                promise
                    .then(() => {
                        if (legacyLedger) {
                            if (transaction.trytes && transaction.trytes.length) {
                                return (
                                    Platform.ledger
                                        .selectSeed(
                                            $hardwareIndexes.accountIndex,
                                            $hardwareIndexes.pageIndex,
                                            ADDRESS_SECURITY_LEVEL
                                        )
                                        .then(({ iota, callback }) => {
                                            closeTransport = callback
                                            return createMinedLedgerMigrationBundle(
                                                transaction.index,
                                                iota.prepareTransfers,
                                                callback
                                            )
                                        })
                                        // .then(({ trytes, bundleHash }) => {
                                        //     closePopup(true) // close transaction popup
                                        //     setMigratingTransaction(transaction, 1)
                                        //     return sendLedgerMigrationBundle(bundleHash, trytes)
                                        // })
                                        .then(() => {
                                            migratedAndUnconfirmedBundles = [
                                                ...migratedAndUnconfirmedBundles,
                                                transaction.bundleHash,
                                            ]
                                        })
                                )
                            }

                            return Platform.ledger
                                .selectSeed(
                                    $hardwareIndexes.accountIndex,
                                    $hardwareIndexes.pageIndex,
                                    ADDRESS_SECURITY_LEVEL
                                )
                                .then(({ iota, callback }) => {
                                    closeTransport = callback
                                    return createLedgerMigrationBundle(
                                        transaction.index,
                                        iota.prepareTransfers,
                                        callback
                                    )
                                })
                            // .then(({ trytes, bundleHash }) => {
                            //     closePopup(true) // close transaction popup
                            //     setMigratingTransaction(transaction, 1)
                            //     transactions = transactions.map((_transaction) => {
                            //         if (_transaction.index === transaction.index) {
                            //             return { ..._transaction, bundleHash }
                            //         }

                            //         return _transaction
                            //     })

                            //     return sendLedgerMigrationBundle(bundleHash, trytes).then(() => {
                            //         migratedAndUnconfirmedBundles = [...migratedAndUnconfirmedBundles, bundleHash]
                            //     })
                            // })
                        }

                        if (transaction.bundleHash) {
                            setMigratingTransaction(transaction, 1)

                            // return sendMigrationBundle(transaction.bundleHash).then(() => {
                            //     migratedAndUnconfirmedBundles = [
                            //         ...migratedAndUnconfirmedBundles,
                            //         transaction.bundleHash,
                            //     ]
                            // })
                        }

                        // return createMigrationBundle(getInputIndexesForBundle(transaction), 0, false).then((data) => {
                        //     setMigratingTransaction(transaction, 1)
                        //     transactions = transactions.map((_transaction) => {
                        //         if (_transaction.index === transaction.index) {
                        //             return { ..._transaction, bundleHash: data.bundleHash }
                        //         }

                        //         return _transaction
                        //     })

                        //     return sendMigrationBundle(data.bundleHash).then(() => {
                        //         migratedAndUnconfirmedBundles = [...migratedAndUnconfirmedBundles, data.bundleHash]
                        //     })
                        // })
                    })
                    .catch((error) => {
                        console.error(error)

                        if (legacyLedger) {
                            closePopup(true) // close transaction popup
                            closeTransport()
                            displayNotificationForLedgerProfile('error', false, true, error)
                        }

                        transactions = transactions.map((_transaction) => {
                            if (_transaction.index === transaction.index) {
                                return {
                                    ..._transaction,
                                    status: -1,
                                    errorText: localize('views.migrate.migrationFailed'),
                                }
                            }

                            return _transaction
                        })

                        if (
                            idx === _unmigratedBundles.length - 1 &&
                            _unmigratedBundles.every((bundle) => {
                                const tx = transactions.find((tx) => tx.index === bundle.index)

                                return tx.status !== 0
                            })
                        ) {
                            migrated = true
                            busy = false
                        }
                    }),
            Promise.resolve([])
        )
    }

    function persistProfile(): void {
        if (legacyLedger && !$newProfile) {
            return
        }

        // When the first migration bundle is broadcast, then persist profile

        addNewProfile($newProfile)
        loadPersistedProfileIntoActiveProfile($newProfile.id)
        void login()
        newProfile.set(null)
    }

    function handleMigrateClick(): void {
        if (legacyLedger) {
            const _onConnected = () => migrateFunds()
            promptUserToConnectLedger(true, _onConnected)
        } else {
            migrateFunds()
        }
    }

    function migrateFunds(): void {
        migratingFundsMessage = localize('views.migrate.migrating')

        transactions.reduce(
            (promise, transaction, idx) =>
                // @ts-ignore
                promise
                    .then(() => {
                        if (legacyLedger) {
                            if (transaction.trytes && transaction.trytes.length) {
                                return (
                                    Platform.ledger
                                        .selectSeed(
                                            $hardwareIndexes.accountIndex,
                                            $hardwareIndexes.pageIndex,
                                            ADDRESS_SECURITY_LEVEL
                                        )
                                        .then(({ iota, callback }) => {
                                            closeTransport = callback
                                            return createMinedLedgerMigrationBundle(
                                                transaction.index,
                                                iota.prepareTransfers,
                                                callback
                                            )
                                        })
                                        // .then(({ trytes, bundleHash }) => {
                                        //     closePopup(true) // close transaction popup
                                        //     setMigratingTransaction(transaction, 1)
                                        //     transactions = transactions.map((_transaction) => {
                                        //         if (_transaction.index === transaction.index) {
                                        //             return { ..._transaction, bundleHash }
                                        //         }

                                        //         return _transaction
                                        //     })

                                        //     return sendLedgerMigrationBundle(bundleHash, trytes)
                                        // })
                                        .then(() => {
                                            if (!hasBroadcastAnyBundle) {
                                                hasBroadcastAnyBundle = true

                                                persistProfile()
                                            }

                                            migratedAndUnconfirmedBundles = [
                                                ...migratedAndUnconfirmedBundles,
                                                transaction.bundleHash,
                                            ]
                                        })
                                )
                            }

                            return Platform.ledger
                                .selectSeed(
                                    $hardwareIndexes.accountIndex,
                                    $hardwareIndexes.pageIndex,
                                    ADDRESS_SECURITY_LEVEL
                                )
                                .then(({ iota, callback }) => {
                                    closeTransport = callback
                                    return createLedgerMigrationBundle(
                                        transaction.index,
                                        iota.prepareTransfers,
                                        callback
                                    )
                                })
                                .then(({ bundleHash }) => {
                                    // trytes can be destructured next to bundleHash
                                    closePopup(true) // close transaction popup
                                    setMigratingTransaction(transaction, 1)
                                    transactions = transactions.map((_transaction) => {
                                        if (_transaction.index === transaction.index) {
                                            return { ..._transaction, bundleHash }
                                        }

                                        return _transaction
                                    })

                                    // return sendLedgerMigrationBundle(bundleHash, trytes).then(() => {
                                    //     if (!hasBroadcastAnyBundle) {
                                    //         hasBroadcastAnyBundle = true

                                    //         persistProfile()
                                    //     }

                                    //     migratedAndUnconfirmedBundles = [...migratedAndUnconfirmedBundles, bundleHash]
                                    // })
                                })
                        }

                        if (transaction.bundleHash) {
                            setMigratingTransaction(transaction, 1)
                            //
                        }

                        // return createMigrationBundle(getInputIndexesForBundle(transaction), 0, false).then((result) => {
                        //     setMigratingTransaction(transaction, 1)
                        //     transactions = transactions.map((_transaction) => {
                        //         if (_transaction.index === transaction.index) {
                        //             return { ..._transaction, bundleHash: result.bundleHash }
                        //         }

                        //         return _transaction
                        //     })

                        //     return sendMigrationBundle(result.bundleHash).then(() => {
                        //         if (!hasBroadcastAnyBundle) {
                        //             hasBroadcastAnyBundle = true

                        //             persistProfile()
                        //         }

                        //         migratedAndUnconfirmedBundles = [...migratedAndUnconfirmedBundles, result.bundleHash]
                        //     })
                        // })
                    })
                    .catch((error) => {
                        console.error(error)

                        if (legacyLedger) {
                            closePopup(true) // close transaction popup
                            closeTransport()
                            displayNotificationForLedgerProfile('error', false, true, error)
                        }

                        transactions = transactions.map((_transaction) => {
                            if (_transaction.index === transaction.index) {
                                return { ..._transaction, status: -1, errorText: 'Migration failed' }
                            }

                            return _transaction
                        })

                        if (idx === transactions.length - 1 && transactions.every((tx) => tx.status !== 0)) {
                            migrated = true
                            busy = false
                        }
                    }),
            Promise.resolve([])
        )
    }

    onDestroy(() => {
        unsubscribeConfirmedBundles()
        unsubscribeSelectedBundles()
    })
</script>

<OnboardingLayout
    allowBack={!$hasMigratedAnyBundle && !busy}
    onBackClick={handleBackClick}
    class=""
    showLedgerProgress={legacyLedger}
    showLedgerVideoButton={legacyLedger}
>
    <div slot="title">
        <Text type="h2">{localize('views.migrate.title')}</Text>
    </div>
    <div slot="leftpane__content" class="h-full flex flex-col flex-wrap">
        <Text type="p" secondary classes="mb-4">{localize('views.transferFragmentedFunds.body1')}</Text>
        {#if legacyLedger}
            <Text type="p" secondary classes="mb-4">
                {localize('views.transferFragmentedFunds.body2', { values: { legacy: LedgerAppName.IOTALegacy } })}
            </Text>
        {/if}
        <div class="flex-auto overflow-y-auto h-1 space-y-4 w-full scrollable-y scroll-secondary">
            {#each transactions as transaction}
                <TransactionItem {...transaction} {localize} />
            {/each}
        </div>
    </div>
    <div slot="leftpane__action" class="flex flex-col items-center space-y-4">
        {#if !migrated}
            <Button
                disabled={busy}
                classes="w-full py-3 mt-2 text-white {$popupState.active && 'opacity-20'}"
                onClick={handleMigrateClick}
            >
                {#if !busy}
                    {localize('views.transferFragmentedFunds.migrate')}
                {:else}
                    <Spinner {busy} message={migratingFundsMessage} classes="justify-center" />
                {/if}
            </Button>
        {:else if fullSuccess}
            <Button classes="w-full py-3 mt-2" onClick={handleContinueClick}>{localize('actions.continue')}</Button>
        {:else}
            <Button classes="w-full py-3 mt-2 {$popupState.active && 'opacity-20'}" onClick={handleRerunClick}>
                {localize('views.transferFragmentedFunds.rerun')}
            </Button>
        {/if}
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center {!$mobile && 'bg-pastel-blue dark:bg-gray-900'}">
        <Animation classes="setup-anim-aspect-ratio" {animation} />
    </div>
</OnboardingLayout>
