<script lang="typescript">
    import { isDeepLinkRequestActive } from '@common/deep-links'
    import { AccountActionsModal, DashboardPane, Drawer, Text } from 'shared/components'
    import {
        AccountActions,
        AddressHistory,
        DeleteAccount,
        ExportTransactionHistory,
        HideAccount,
    } from 'shared/components/drawerContent'
    import { clearSendParams, loggedIn, mobile, sendParams } from 'shared/lib/app'
    import { deepCopy } from 'shared/lib/helpers'
    import { localize } from 'shared/lib/i18n'
    import { displayNotificationForLedgerProfile, promptUserToConnectLedger } from 'shared/lib/ledger'
    import { addProfileCurrencyPriceData } from 'shared/lib/market'
    import { showAppNotification } from 'shared/lib/notifications'
    import { closePopup, openPopup } from 'shared/lib/popup'
    import {
        activeProfile,
        getColor,
        isLedgerProfile,
        isSoftwareProfile,
        isStrongholdLocked,
        setMissingProfileType,
    } from 'shared/lib/profile'
    import { accountRoute } from 'shared/lib/router'
    import { checkStronghold } from 'shared/lib/stronghold'
    import { AccountIdentifier } from 'shared/lib/typings/account'
    import { LedgerErrorType, TransferProgressEventType } from 'shared/lib/typings/events'
    import { Message, Transaction } from 'shared/lib/typings/message'
    import { AccountRoutes } from 'shared/lib/typings/routes'
    import { WalletAccount } from 'shared/lib/typings/wallet'
    import {
        addMessagesPair,
        api,
        asyncSyncAccounts,
        getAccountMessages,
        getAccountMeta,
        getSyncAccountOptions,
        hasGeneratedALedgerReceiveAddress,
        isFirstSessionSync,
        isTransferring,
        prepareAccountInfo,
        processMigratedTransactions,
        removeEventListeners,
        selectedAccount,
        selectedAccountId,
        transferState,
        updateBalanceOverview,
        wallet,
    } from 'shared/lib/wallet'
    import { initialiseListeners } from 'shared/lib/walletApiListeners'
    import { onMount } from 'svelte'
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

    $: color = getColor($activeProfile, $selectedAccount?.id) as string

    const { accounts, accountsLoaded, internalTransfersInProgress } = $wallet

    let showActionsModal = false

    $: {
        if ($isDeepLinkRequestActive && $sendParams && $sendParams.address) {
            accountRoute.set(AccountRoutes.Send)
            isDeepLinkRequestActive.set(false)
        }
    }

    let isGeneratingAddress = false

    let drawer: Drawer

    // If account changes force regeneration of Ledger receive address
    $: if ($selectedAccountId && $isLedgerProfile) {
        hasGeneratedALedgerReceiveAddress.set(false)
    }

    $: if ($accountsLoaded) {
        // update profileType if it is missing
        if (!$activeProfile?.type) {
            setMissingProfileType($accounts)
        }
    }

    function loadAccounts() {
        const _onError = (error: any = null) => {
            if ($isLedgerProfile) {
                if (!LedgerErrorType[error.type]) {
                    displayNotificationForLedgerProfile('error', true, true, false, false, error)
                }
            } else {
                showAppNotification({
                    type: 'error',
                    message: localize(error?.error || 'error.global.generic'),
                })
            }
        }

        api.getAccounts({
            onSuccess(accountsResponse) {
                const _continue = async () => {
                    accountsLoaded.set(true)

                    const { gapLimit, accountDiscoveryThreshold } = getSyncAccountOptions()

                    try {
                        await asyncSyncAccounts(0, gapLimit, accountDiscoveryThreshold, false)

                        if ($isFirstSessionSync) isFirstSessionSync.set(false)
                    } catch (err) {
                        _onError(err)
                    }
                }

                if (accountsResponse.payload.length === 0) {
                    void _continue()
                } else {
                    const totalBalance = {
                        balance: 0,
                        incoming: 0,
                        outgoing: 0,
                    }

                    let completeCount = 0
                    const newAccounts = []
                    for (const payloadAccount of accountsResponse.payload) {
                        addMessagesPair(payloadAccount)

                        getAccountMeta(payloadAccount.id, (err, meta) => {
                            if (!err) {
                                totalBalance.balance += meta.balance
                                totalBalance.incoming += meta.incoming
                                totalBalance.outgoing += meta.outgoing

                                const account = prepareAccountInfo(payloadAccount, meta)
                                newAccounts.push(account)
                            } else {
                                _onError(err)
                            }

                            completeCount++

                            if (completeCount === accountsResponse.payload.length) {
                                accounts.update((_accounts) => newAccounts.sort((a, b) => a.index - b.index))
                                processMigratedTransactions(
                                    payloadAccount.id,
                                    payloadAccount.messages,
                                    payloadAccount.addresses
                                )
                                updateBalanceOverview(
                                    totalBalance.balance,
                                    totalBalance.incoming,
                                    totalBalance.outgoing
                                )
                                void _continue()
                            }
                        })
                    }
                }
            },
            onError(err) {
                _onError(err)
            },
        })
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

    function onSend(senderAccountId, receiveAddress, amount) {
        const _send = () => {
            isTransferring.set(true)
            api.send(
                senderAccountId,
                {
                    amount,
                    address: receiveAddress,
                    remainder_value_strategy: {
                        strategy: 'ChangeAddress',
                    },
                    indexation: { index: 'firefly', data: [] },
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
                            if ($mobile) {
                                accountRoute.set(AccountRoutes.Init)
                            }
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
                        if ($mobile) {
                            accountRoute.set(AccountRoutes.Init)
                        }
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

    $: if (mobile && drawer && $accountRoute !== AccountRoutes.Init) {
        drawer.open()
    }

    $: if (mobile && drawer && $accountRoute === AccountRoutes.Init) {
        drawer.close()
    }

    onMount(() => {
        // If we are in settings when logged out the router reset
        // switches back to the wallet, but there is no longer
        // an active profile, only init if there is a profile
        if ($activeProfile && $loggedIn) {
            if (!$accountsLoaded) {
                loadAccounts()
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

    const handleMenuClick = () => {
        if ($mobile) {
            return accountRoute.set(AccountRoutes.Actions)
        }
        showActionsModal = !showActionsModal
    }
</script>

{#if $selectedAccount}
    {#if $mobile}
        <div
            style="--account-color: {color};"
            class="{$mobile && 'account-color'} wallet-wrapper w-full h-full flex flex-col bg-gray-50 dark:bg-gray-900"
        >
            <div class="flex flex-auto flex-col">
                <!-- Total Balance, Accounts list & Send/Receive -->
                <div class="flex">
                    <AccountBalance classes="w-full" onMenuClick={handleMenuClick} />
                    <Drawer
                        opened={$accountRoute !== AccountRoutes.Init}
                        bind:this={drawer}
                        onClose={() => accountRoute.set(AccountRoutes.Init)}
                    >
                        {#if $accountRoute === AccountRoutes.Send}
                            <Send {onSend} {onInternalTransfer} />
                        {:else if $accountRoute === AccountRoutes.Receive}
                            <Receive {isGeneratingAddress} {onGenerateAddress} />
                        {:else if $accountRoute === AccountRoutes.Actions}
                            <AccountActions />
                        {:else if $accountRoute === AccountRoutes.Manage}
                            <ManageAccount alias={$selectedAccount.alias} account={$selectedAccount} />
                        {:else if $accountRoute === AccountRoutes.AddressHistory}
                            <AddressHistory account={$selectedAccount} />
                        {:else if $accountRoute === AccountRoutes.ExportTransactionHistory}
                            <ExportTransactionHistory account={$selectedAccount} />
                        {:else if $accountRoute === AccountRoutes.HideAccount}
                            <HideAccount account={$selectedAccount} />
                        {:else if $accountRoute === AccountRoutes.DeleteAccount}
                            <DeleteAccount account={$selectedAccount} />
                        {/if}
                    </Drawer>
                </div>
                <div class="flex flex-1">
                    <DashboardPane classes="w-full rounded-tl-s rounded-tr-s">
                        <AccountHistory
                            color={$selectedAccount.color}
                            transactions={getAccountMessages($selectedAccount)}
                        />/>
                    </DashboardPane>
                </div>
            </div>
        </div>
    {:else}
        <div class="w-full h-full flex flex-col flex-nowrap p-10 relative flex-1 bg-gray-50 dark:bg-gray-900">
            {#key $selectedAccount?.id}
                <div class="w-full h-full grid grid-cols-3 gap-x-4 min-h-0">
                    <DashboardPane classes=" h-full flex flex-auto flex-col flex-shrink-0">
                        {#if $accountRoute !== AccountRoutes.Manage}
                            <AccountBalance onMenuClick={handleMenuClick} />
                        {/if}
                        <DashboardPane classes="h-full -mt-5 z-0">
                            {#if $activeProfile?.hiddenAccounts?.includes($selectedAccount?.id)}
                                <div class="px-6 my-4">
                                    <Text type="p" secondary>{localize('general.accountRemoved')}</Text>
                                </div>
                            {/if}
                            {#if $accountRoute === AccountRoutes.Init}
                                <AccountAssets />
                            {:else if $accountRoute === AccountRoutes.Send}
                                <Send {onSend} {onInternalTransfer} />
                            {:else if $accountRoute === AccountRoutes.Receive}
                                <Receive {isGeneratingAddress} {onGenerateAddress} />
                            {:else if $accountRoute === AccountRoutes.Manage}
                                <ManageAccount alias={$selectedAccount.alias} account={$selectedAccount} />
                            {/if}
                        </DashboardPane>
                    </DashboardPane>
                    <DashboardPane>
                        <AccountHistory
                            color={$selectedAccount.color}
                            transactions={getAccountMessages($selectedAccount)}
                        />
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
                <AccountActionsModal bind:isActive={showActionsModal} />
            {/key}
        </div>
    {/if}
{/if}

<style type="text/scss">
    :global(body.platform-win32) .wallet-wrapper {
        @apply pt-0;
    }
    .account-color {
        background-color: var(--account-color);
    }
</style>
