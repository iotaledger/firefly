<script lang="typescript">
    import { DashboardPane } from 'shared/components'
    import { clearSendParams } from 'shared/lib/app'
    import { appSettings } from 'shared/lib/appSettings'
    import { deepLinkRequestActive } from 'shared/lib/deepLinking'
    import { addProfileCurrencyPriceData, priceData } from 'shared/lib/marketData'
    import { DEFAULT_NODE, DEFAULT_NODES, network } from 'shared/lib/network'
    import { showAppNotification } from 'shared/lib/notifications'
    import { openPopup } from 'shared/lib/popup'
    import { activeProfile, isStrongholdLocked } from 'shared/lib/profile'
    import { walletRoute } from 'shared/lib/router'
    import { WalletRoutes } from 'shared/lib/typings/routes'
    import {
        AccountMessage,
        AccountsBalanceHistory,
        api,
        BalanceHistory,
        BalanceOverview,
        getAccountMeta,
        getAccountsBalanceHistory,
        getTransactions,
        getWalletBalanceHistory,
        initialiseListeners,
        isTransferring,
        prepareAccountInfo,
        removeEventListeners,
        selectedAccountId,
        syncAccounts,
        transferState,
        updateBalanceOverview,
        wallet,
        WalletAccount,
    } from 'shared/lib/wallet'
    import { onMount, setContext } from 'svelte'
    import { derived, Readable, Writable } from 'svelte/store'
    import { Account, CreateAccount, LineChart, Security, WalletActions, WalletBalance, WalletHistory } from './views/'

    export let locale

    const { accounts, balanceOverview, accountsLoaded } = $wallet

    const transactions = derived(accounts, ($accounts) => {
        return getTransactions($accounts)
    })
    const accountsBalanceHistory = derived([accounts, priceData], ([$accounts, $priceData]) =>
        getAccountsBalanceHistory($accounts, $priceData)
    )
    const walletBalanceHistory = derived(accountsBalanceHistory, ($accountsBalanceHistory) =>
        getWalletBalanceHistory($accountsBalanceHistory)
    )
    const selectedAccount = derived([selectedAccountId, accounts], ([$selectedAccountId, $accounts]) =>
        $accounts.find((acc) => acc.id === $selectedAccountId)
    )

    const viewableAccounts: Readable<WalletAccount[]> = derived([activeProfile, accounts], ([$activeProfile, $accounts]) => {
        if (!$activeProfile) {
            return []
        }
        return $activeProfile.settings.showDeletedAccounts
            ? $accounts
            : $accounts.filter((a) => !$activeProfile.deletedAccounts.includes(a.id))
    })

    const liveAccounts: Readable<WalletAccount[]> = derived([activeProfile, accounts], ([$activeProfile, $accounts]) => {
        if (!$activeProfile) {
            return []
        }    
        return $accounts.filter((a) => !$activeProfile.deletedAccounts.includes(a.id))
    })

    setContext<Writable<BalanceOverview>>('walletBalance', balanceOverview)
    setContext<Writable<WalletAccount[]>>('walletAccounts', accounts)
    setContext<Readable<WalletAccount[]>>('viewableAccounts', viewableAccounts)
    setContext<Readable<WalletAccount[]>>('liveAccounts', liveAccounts)
    setContext<Writable<boolean>>('walletAccountsLoaded', accountsLoaded)
    setContext<Readable<AccountMessage[]>>('walletTransactions', transactions)
    setContext<Readable<WalletAccount>>('selectedAccount', selectedAccount)
    setContext<Readable<AccountsBalanceHistory>>('accountsBalanceHistory', accountsBalanceHistory)
    setContext<Readable<BalanceHistory>>('walletBalanceHistory', walletBalanceHistory)

    let isGeneratingAddress = false

    function getAccounts() {
        api.getAccounts({
            onSuccess(accountsResponse) {
                const _continue = () => {
                    accountsLoaded.set(true)
                    syncAccounts()
                }

                if (accountsResponse.payload.length === 0) {
                    _continue()
                } else {
                    const totalBalance = {
                        balance: 0,
                        incoming: 0,
                        outgoing: 0,
                    }

                    for (const [idx, storedAccount] of accountsResponse.payload.entries()) {
                        getAccountMeta(storedAccount.id, (err, meta) => {
                            if (!err) {
                                totalBalance.balance += meta.balance
                                totalBalance.incoming += meta.incoming
                                totalBalance.outgoing += meta.outgoing

                                const account = prepareAccountInfo(storedAccount, meta)
                                accounts.update((accounts) => [...accounts, account])

                                if (idx === accountsResponse.payload.length - 1) {
                                    updateBalanceOverview(totalBalance.balance, totalBalance.incoming, totalBalance.outgoing)
                                    _continue()
                                }
                            } else {
                                console.error(err)
                            }
                        })
                    }
                }
            },
            onError(err) {
                showAppNotification({
                    type: 'error',
                    message: locale(err.error),
                })
            },
        })
    }

    function onGenerateAddress(accountId) {
        const _generate = () => {
            isGeneratingAddress = true
            api.getUnusedAddress(accountId, {
                onSuccess(response) {
                    accounts.update((accounts) =>
                        accounts.map((account) => {
                            if (account.id === accountId) {
                                return Object.assign<WalletAccount, WalletAccount, Partial<WalletAccount>>(
                                    {} as WalletAccount,
                                    account,
                                    {
                                        depositAddress: response.payload.address,
                                    }
                                )
                            }

                            return account
                        })
                    )
                    isGeneratingAddress = false
                },
                onError(err) {
                    isGeneratingAddress = false
                    showAppNotification({
                        type: 'error',
                        message: locale(err.error),
                    })
                },
            })
        }

        api.getStrongholdStatus({
            onSuccess(strongholdStatusResponse) {
                if (strongholdStatusResponse.payload.snapshot.status === 'Locked') {
                    openPopup({ type: 'password', props: { onSuccess: _generate } })
                } else {
                    _generate()
                }
            },
            onError(err) {
                showAppNotification({
                    type: 'error',
                    message: locale(err.error),
                })
            },
        })
    }

    function onCreateAccount(alias, completeCallback) {
        const _create = () =>
            api.createAccount(
                {
                    alias,
                    signerType: { type: 'Stronghold' },
                    clientOptions: {
                        node: $accounts.length > 0 ? $accounts[0].clientOptions.node : DEFAULT_NODE,
                        nodes: $accounts.length > 0 ? $accounts[0].clientOptions.nodes : DEFAULT_NODES,
                        // For subsequent accounts, use the network for any of the previous accounts
                        network: $accounts.length > 0 ? $accounts[0].clientOptions.network : $network,
                    },
                },
                {
                    onSuccess(createAccountResponse) {
                        const account: WalletAccount = prepareAccountInfo(createAccountResponse.payload, {
                            balance: 0,
                            incoming: 0,
                            outgoing: 0,
                            depositAddress: createAccountResponse.payload.addresses[0].address,
                        })
                        // immediately store the account; we update it later after sync
                        // we do this to allow offline account creation
                        accounts.update((accounts) => [...accounts, account])
                        return new Promise((resolve) => {
                            api.syncAccount(createAccountResponse.payload.id, {
                                onSuccess(_syncAccountResponse) {
                                    getAccountMeta(createAccountResponse.payload.id, (err, meta) => {
                                        if (!err) {
                                            const account = prepareAccountInfo(createAccountResponse.payload, meta)
                                            accounts.update((storedAccounts) => {
                                                return storedAccounts.map((storedAccount) => {
                                                    if (storedAccount.id === account.id) {
                                                        return account
                                                    }
                                                    return storedAccount
                                                })
                                            })
                                        }
                                        resolve(null)
                                    })
                                },
                                onError() {
                                    // we ignore sync errors since the user can recover from it later
                                    // this allows an account to be created by an offline user
                                    resolve(null)
                                },
                            })
                        }).then(() => {
                            walletRoute.set(WalletRoutes.Init)
                            completeCallback()
                        })
                    },
                    onError(err) {
                        completeCallback(locale(err.error))
                    },
                }
            )

        api.getStrongholdStatus({
            onSuccess(strongholdStatusResponse) {
                if (strongholdStatusResponse.payload.snapshot.status === 'Locked') {
                    openPopup({ type: 'password', props: { onSuccess: _create, onCancelled: completeCallback } })
                } else {
                    _create()
                }
            },
            onError(err) {
                completeCallback(locale(err.error))
            },
        })
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
                    indexation: { index: 'firefly', data: new Array() },
                },
                {
                    onSuccess(response) {
                        accounts.update((_accounts) => {
                            return _accounts.map((_account) => {
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
                        })

                        transferState.set('Complete')

                        setTimeout(() => {
                            clearSendParams()
                            isTransferring.set(false)
                        }, 3000)
                    },
                    onError(err) {
                        isTransferring.set(false)
                        showAppNotification({
                            type: 'error',
                            message: locale(err.error),
                        })
                    },
                }
            )
        }

        api.getStrongholdStatus({
            onSuccess(strongholdStatusResponse) {
                if (strongholdStatusResponse.payload.snapshot.status === 'Locked') {
                    openPopup({
                        type: 'password',
                        props: {
                            onSuccess: _send,
                        },
                    })
                } else {
                    _send()
                }
            },
            onError(err) {
                showAppNotification({
                    type: 'error',
                    message: locale(err.error),
                })
            },
        })
    }

    function onInternalTransfer(senderAccountId, receiverAccountId, amount) {
        const _internalTransfer = () => {
            isTransferring.set(true)
            api.internalTransfer(senderAccountId, receiverAccountId, amount, {
                onSuccess(response) {
                    const message = response.payload

                    accounts.update((_accounts) => {
                        return _accounts.map((_account) => {
                            const isSenderAccount = _account.id === senderAccountId
                            const isReceiverAccount = _account.id === receiverAccountId
                            if (isSenderAccount || isReceiverAccount) {
                                return Object.assign<WalletAccount, WalletAccount, Partial<WalletAccount>>(
                                    {} as WalletAccount,
                                    _account,
                                    {
                                        messages: [
                                            Object.assign({}, message, {
                                                payload: Object.assign({}, message.payload, {
                                                    data: Object.assign({}, message.payload.data, {
                                                        essence: Object.assign({}, message.payload.data.essence, {
                                                            data: Object.assign({}, message.payload.data.essence.data, {
                                                                incoming: isReceiverAccount,
                                                            }),
                                                        }),
                                                    }),
                                                }),
                                            }),
                                            ..._account.messages,
                                        ],
                                    }
                                )
                            }

                            return _account
                        })
                    })

                    transferState.set('Complete')

                    setTimeout(() => {
                        clearSendParams(true)
                        isTransferring.set(false)
                    }, 3000)
                },
                onError(err) {
                    isTransferring.set(false)
                    showAppNotification({
                        type: 'error',
                        message: locale(err.error),
                    })
                },
            })
        }

        api.getStrongholdStatus({
            onSuccess(strongholdStatusResponse) {
                if (strongholdStatusResponse.payload.snapshot.status === 'Locked') {
                    openPopup({ type: 'password', props: { onSuccess: _internalTransfer } })
                } else {
                    _internalTransfer()
                }
            },
            onError(err) {
                showAppNotification({
                    type: 'error',
                    message: locale(err.error),
                })
            },
        })
    }

    $: {
        if ($deepLinkRequestActive && $appSettings.deepLinking) {
            walletRoute.set(WalletRoutes.Send)
            deepLinkRequestActive.set(false)
        }
    }

    onMount(() => {
        if (!$accountsLoaded) {
            getAccounts()
        }

        removeEventListeners($activeProfile.id)

        initialiseListeners()

        api.getStrongholdStatus({
            onSuccess(strongholdStatusResponse) {
                isStrongholdLocked.set(strongholdStatusResponse.payload.snapshot.status === 'Locked')
            },
            onError(error) {
                console.error(error)
            },
        })

        addProfileCurrencyPriceData()
    })
</script>

<style type="text/scss">
    :global(body.platform-win32) .wallet-wrapper {
        @apply pt-0;
    }
</style>

{#if $walletRoute === WalletRoutes.Account && $selectedAccountId}
    <Account
        {isGeneratingAddress}
        send={onSend}
        internalTransfer={onInternalTransfer}
        generateAddress={onGenerateAddress}
        {locale} />
{:else}
    <div class="wallet-wrapper w-full h-full flex flex-col p-10 flex-1 bg-gray-50 dark:bg-gray-900">
        <div class="w-full h-full grid grid-cols-3 gap-x-4 min-h-0">
            <DashboardPane classes="h-full">
                <!-- Total Balance, Accounts list & Send/Receive -->
                <div class="flex flex-auto flex-col h-full">
                    {#if $walletRoute === WalletRoutes.CreateAccount}
                        <CreateAccount onCreate={onCreateAccount} {locale} />
                    {:else}
                        <WalletBalance {locale} />
                        <DashboardPane classes="-mt-5 h-full z-0">
                            <WalletActions
                                {isGeneratingAddress}
                                send={onSend}
                                internalTransfer={onInternalTransfer}
                                generateAddress={onGenerateAddress}
                                {locale} />
                        </DashboardPane>
                    {/if}
                </div>
            </DashboardPane>
            <div class="flex flex-col col-span-2 h-full space-y-4">
                <DashboardPane classes="w-full h-1/2">
                    <LineChart {locale} />
                </DashboardPane>
                <div class="w-full h-1/2 flex flex-row flex-1 space-x-4">
                    <DashboardPane classes="w-1/2">
                        <WalletHistory {locale} />
                    </DashboardPane>
                    <DashboardPane classes="w-1/2">
                        <Security {locale} />
                    </DashboardPane>
                </div>
            </div>
        </div>
    </div>
{/if}
