<script lang="typescript">
    import { isDeepLinkRequestActive } from '@common/deep-links'
    import { localize } from '@core/i18n'
    import { accountRoute, accountRouter } from '@core/router'
    import { AccountRoute } from '@core/router/enums'
    import { convertStringToUtf8Array } from '@lib/utils'
    import { asyncGetAccounts, setSelectedAccount } from '@lib/wallet'
    import { AccountActionsModal, DashboardPane, Modal, Text } from 'shared/components'
    import { clearSendParams, loggedIn, sendParams } from 'shared/lib/app'
    import { deepCopy } from 'shared/lib/helpers'
    import { displayNotificationForLedgerProfile, promptUserToConnectLedger } from 'shared/lib/ledger'
    import { addProfileCurrencyPriceData } from 'shared/lib/market'
    import { showAppNotification } from 'shared/lib/notifications'
    import { haveStakingResultsCached } from 'shared/lib/participation/staking'
    import { closePopup, openPopup } from 'shared/lib/popup'
    import {
        activeProfile,
        isLedgerProfile,
        isSoftwareProfile,
        isStrongholdLocked,
        setMissingProfileType,
    } from 'shared/lib/profile'
    import { checkStronghold } from 'shared/lib/stronghold'
    import { AccountIdentifier } from 'shared/lib/typings/account'
    import { LedgerErrorType, TransferProgressEventType } from 'shared/lib/typings/events'
    import { Message, Transaction } from 'shared/lib/typings/message'
    import { WalletAccount } from 'shared/lib/typings/wallet'
    import {
        accountSyncingQueueStore,
        api,
        asyncSyncAccounts,
        getAccountMessages,
        getAccountSyncOptions,
        hasGeneratedALedgerReceiveAddress,
        initializeAccountSyncingQueue,
        isBackgroundSyncing,
        isFirstSessionSync,
        isInitialAccountSync,
        isTransferring,
        processAccountSyncingQueue,
        processLoadedAccounts,
        removeEventListeners,
        selectedAccountIdStore,
        selectedAccountStore,
        transferState,
        wallet,
    } from 'shared/lib/wallet'
    import { initialiseListeners } from 'shared/lib/walletApiListeners'
    import { getContext, onMount } from 'svelte'
    import { get, Readable } from 'svelte/store'
    import {
        AccountAssets,
        AccountBalance,
        AccountHistory,
        BarChart,
        LineChart,
        ManageAccount,
        Receive,
        Send,
    } from './views/'

    const { accounts, accountsLoaded, internalTransfersInProgress } = $wallet

    const viewableAccounts = getContext<Readable<WalletAccount[]>>('viewableAccounts')

    let modal: Modal

    $: {
        if ($isDeepLinkRequestActive && $sendParams && $sendParams.address) {
            $accountRouter.goTo(AccountRoute.Send)
            isDeepLinkRequestActive.set(false)
        }
    }

    let isGeneratingAddress = false

    // If account changes force regeneration of Ledger receive address
    $: if ($selectedAccountIdStore && $isLedgerProfile) {
        hasGeneratedALedgerReceiveAddress.set(false)
    }

    $: if ($accountsLoaded) {
        // update profileType if it is missing
        if (!$activeProfile?.type) {
            setMissingProfileType($accounts)
        }
    }

    $: accountSyncingQueueLength = $accountSyncingQueueStore?.length || 0
    $: if (accountSyncingQueueLength > 0) {
        void processAccountSyncingQueue()
    } else {
        if ($isFirstSessionSync && $accountSyncingQueueStore !== null) {
            isFirstSessionSync.set(false)
        }
    }

    async function loadAccounts(): Promise<void> {
        try {
            const loadedAccounts = await asyncGetAccounts()
            await processLoadedAccounts(loadedAccounts)
            setSelectedAccount($activeProfile.lastUsedAccountId ?? $viewableAccounts?.[0]?.id ?? null)
            accountsLoaded.set(true)
            const { gapLimit, accountDiscoveryThreshold } = getAccountSyncOptions()

            if (isInitialAccountSync()) {
                await asyncSyncAccounts(0, gapLimit, accountDiscoveryThreshold, false)
                isFirstSessionSync.set(false)
            } else {
                initializeAccountSyncingQueue()
            }
            if (!get(isBackgroundSyncing)) {
                api.startBackgroundSync(
                    {
                        secs: 30,
                        nanos: 0,
                    },
                    true,
                    gapLimit,
                    {
                        onSuccess() {
                            isBackgroundSyncing.set(true)
                        },
                        onError(err) {
                            showAppNotification({
                                type: 'error',
                                message: localize('error.account.syncing'),
                            })
                        },
                    }
                )
            }
        } catch (err) {
            if ($isLedgerProfile) {
                if (!LedgerErrorType[err.type]) {
                    displayNotificationForLedgerProfile('error', true, true, false, false, err)
                }
            } else {
                showAppNotification({
                    type: 'error',
                    message: localize(err?.error || 'error.global.generic'),
                })
            }
        }
    }

    function onGenerateAddress(accountId: AccountIdentifier) {
        const _generate = () => {
            isGeneratingAddress = true

            if ($isLedgerProfile) displayNotificationForLedgerProfile('error', true, true)

            api.getUnusedAddress(accountId.toString(), {
                onSuccess(response) {
                    accounts.update((accounts) =>
                        accounts.map((account) => {
                            if (account.id === accountId) {
                                account.depositAddress = response.payload.address

                                if (!account.addresses.some((a) => a.address === response.payload.address)) {
                                    account.addresses.push(response.payload)
                                }
                            }

                            return account
                        })
                    )
                    closePopup(true)

                    isGeneratingAddress = false
                    hasGeneratedALedgerReceiveAddress.set(true)
                },
                onError(err) {
                    closePopup(true)

                    console.error(err)

                    isGeneratingAddress = false

                    const isClientError = err && err.type === 'ClientError'
                    const shouldHideErrorNotification =
                        isClientError && err.error === 'error.node.chrysalisNodeInactive'
                    if (!shouldHideErrorNotification) {
                        /**
                         * NOTE: To ensure a clear error message (for Ledger users),
                         * we need to update the locale path.
                         */
                        const localePath =
                            isClientError && $isLedgerProfile ? 'error.ledger.generateAddress' : err.error
                        showAppNotification({
                            type: 'error',
                            message: localize(localePath),
                        })
                    }
                },
            })
        }

        if ($isSoftwareProfile) {
            api.getStrongholdStatus({
                onSuccess(strongholdStatusResponse) {
                    if (strongholdStatusResponse.payload.snapshot.status === 'Locked') {
                        openPopup({ type: 'password', props: { onSuccess: _generate } })
                    } else {
                        _generate()
                    }
                },
                onError(error) {
                    console.error(error)
                },
            })
        } else {
            promptUserToConnectLedger(false, () => _generate(), undefined)
        }
    }

    function onSend(senderAccountId, receiveAddress, amount, dataString) {
        const _send = () => {
            isTransferring.set(true)
            const index = dataString ? 'swapOut' : 'firefly'
            const data = dataString ? convertStringToUtf8Array(dataString) : null
            api.send(
                senderAccountId,
                {
                    amount,
                    address: receiveAddress,
                    remainder_value_strategy: {
                        strategy: 'ChangeAddress',
                    },
                    indexation: { index, data },
                },
                {
                    onSuccess(response) {
                        accounts.update((_accounts) =>
                            _accounts.map((_account) => {
                                if (_account.id === senderAccountId) {
                                    return Object.assign<WalletAccount, WalletAccount, Partial<WalletAccount>>(
                                        {} as WalletAccount,
                                        _account,
                                        {
                                            messages: [response.payload, ..._account.messages],
                                        }
                                    )
                                }

                                return _account
                            })
                        )

                        transferState.set({
                            type: TransferProgressEventType.Complete,
                        })

                        setTimeout(() => {
                            clearSendParams()
                            isTransferring.set(false)
                        }, 3000)
                    },
                    onError(err) {
                        isTransferring.set(false)
                        showAppNotification({
                            type: 'error',
                            message: localize(err.error),
                        })
                    },
                }
            )
        }

        if ($isSoftwareProfile) {
            checkStronghold(_send)
        } else {
            _send()
        }
    }

    function onInternalTransfer(senderAccountId, receiverAccountId, amount, internal) {
        const _internalTransfer = () => {
            isTransferring.set(true)
            api.internalTransfer(senderAccountId, receiverAccountId, amount, {
                onSuccess(response) {
                    const message = response.payload

                    internalTransfersInProgress.update((transfers) => {
                        transfers[message.id] = {
                            from: senderAccountId,
                            to: receiverAccountId,
                        }

                        return transfers
                    })

                    accounts.update((_accounts) =>
                        _accounts.map((_account) => {
                            if (_account.id === senderAccountId) {
                                const m = deepCopy(message) as Message
                                const mPayload = m.payload as Transaction
                                mPayload.data.essence.data.incoming = false
                                mPayload.data.essence.data.internal = true
                                _account.messages.push(m)
                            }
                            if (_account.id === receiverAccountId) {
                                const m = deepCopy(message) as Message
                                const mPayload = m.payload as Transaction
                                mPayload.data.essence.data.incoming = true
                                mPayload.data.essence.data.internal = true
                                _account.messages.push(m)
                            }

                            return _account
                        })
                    )

                    transferState.set({
                        type: TransferProgressEventType.Complete,
                    })

                    setTimeout(() => {
                        clearSendParams(internal)
                        isTransferring.set(false)
                    }, 3000)
                },
                onError(err) {
                    isTransferring.set(false)
                    showAppNotification({
                        type: 'error',
                        message: localize(err.error),
                    })
                },
            })
        }

        if ($isSoftwareProfile) {
            api.getStrongholdStatus({
                onSuccess(strongholdStatusResponse) {
                    if (strongholdStatusResponse.payload.snapshot.status === 'Locked') {
                        openPopup({ type: 'password', props: { onSuccess: _internalTransfer } })
                    } else {
                        _internalTransfer()
                    }
                },
                onError(error) {
                    console.error(error)
                },
            })
        } else {
            _internalTransfer()
        }
    }

    onMount(() => {
        // If we are in settings when logged out the router reset
        // switches back to the wallet, but there is no longer
        // an active profile, only init if there is a profile
        if ($activeProfile && $loggedIn) {
            if (!$accountsLoaded) {
                void loadAccounts()
            }

            removeEventListeners($activeProfile.id)

            initialiseListeners()

            if ($isSoftwareProfile) {
                api.getStrongholdStatus({
                    onSuccess(strongholdStatusResponse) {
                        isStrongholdLocked.set(strongholdStatusResponse.payload.snapshot.status === 'Locked')
                    },
                    onError(error) {
                        console.error(error)
                    },
                })
            }

            void addProfileCurrencyPriceData()
        }
    })
</script>

{#if $selectedAccountStore}
    <div class="w-full h-full flex flex-col flex-nowrap p-10 relative flex-1 bg-gray-50 dark:bg-gray-900">
        {#key $selectedAccountStore?.id}
            <div class="w-full h-full grid grid-cols-3 gap-x-4 min-h-0">
                <DashboardPane classes=" h-full flex flex-auto flex-col flex-shrink-0">
                    {#if $accountRoute !== AccountRoute.Manage}
                        <AccountBalance onMenuClick={modal?.toggle} />
                    {/if}
                    <DashboardPane classes="h-full {$accountRoute !== AccountRoute.Manage ? '-mt-5' : ''} z-0">
                        {#if $activeProfile?.hiddenAccounts?.includes($selectedAccountStore?.id)}
                            <div class="px-6 my-4">
                                <Text type="p" secondary>{localize('general.accountRemoved')}</Text>
                            </div>
                        {/if}
                        {#if $accountRoute === AccountRoute.Init}
                            {#key $haveStakingResultsCached}
                                <AccountAssets />
                            {/key}
                        {:else if $accountRoute === AccountRoute.Send}
                            <Send {onSend} {onInternalTransfer} />
                        {:else if $accountRoute === AccountRoute.Receive}
                            <Receive {isGeneratingAddress} {onGenerateAddress} />
                        {:else if $accountRoute === AccountRoute.Manage}
                            <ManageAccount alias={$selectedAccountStore.alias} account={$selectedAccountStore} />
                        {/if}
                    </DashboardPane>
                </DashboardPane>
                <DashboardPane>
                    <AccountHistory transactions={getAccountMessages($selectedAccountStore)} />
                </DashboardPane>
                <div class=" flex flex-col space-y-4">
                    <DashboardPane classes="w-full h-1/2">
                        <LineChart />
                    </DashboardPane>
                    <DashboardPane classes="w-full h-1/2">
                        <BarChart />
                    </DashboardPane>
                </div>
            </div>
            <AccountActionsModal bind:modal />
        {/key}
    </div>
{/if}

<style type="text/scss">
    :global(body.platform-win32) .wallet-wrapper {
        @apply pt-0;
    }
</style>
