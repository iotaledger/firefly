<script lang="typescript">
    import type { Account as BaseAccount } from 'lib/typings/account'
    import type { ErrorEventPayload } from 'lib/typings/events'
    import { DashboardPane } from 'shared/components'
    import { sendParams } from 'shared/lib/app'
    import { convertToFiat, currencies, CurrencyTypes, exchangeRates } from 'shared/lib/currency'
    import { deepLinkRequestActive } from 'shared/lib/deepLinking'
    import { priceData } from 'shared/lib/marketData'
    import { DEFAULT_NODE, DEFAULT_NODES, network } from 'shared/lib/network'
    import { openPopup } from 'shared/lib/popup'
    import { activeProfile, updateProfile } from 'shared/lib/profile'
    import { walletRoute } from 'shared/lib/router'
    import { WalletRoutes } from 'shared/lib/typings/routes'
    import { formatUnit } from 'shared/lib/units'
    import { showAppNotification } from 'shared/lib/notifications'
    import {
        AccountMessage,
        api,
        BalanceHistory,
        BalanceOverview,
        getAccountsBalanceHistory,
        getLatestMessages,
        getWalletBalanceHistory,
        initialiseListeners,
        isTransferring,
        selectedAccountId,
        updateAccounts,
        updateBalanceOverview,
        wallet,
        WalletAccount,
    } from 'shared/lib/wallet'
    import { onMount, setContext } from 'svelte'
    import { derived, get, Readable, Writable } from 'svelte/store'
    import { Account, CreateAccount, LineChart, Security, WalletActions, WalletBalance, WalletHistory } from './views/'

    export let locale

    const AccountColors = ['turquoise', 'green', 'orange', 'yellow', 'purple', 'pink']

    const { accounts, balanceOverview, accountsLoaded } = $wallet

    const transactions = derived(accounts, ($accounts) => {
        return getLatestMessages($accounts)
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

    setContext<Writable<BalanceOverview>>('walletBalance', balanceOverview)
    setContext<Writable<WalletAccount[]>>('walletAccounts', accounts)
    setContext<Writable<boolean>>('walletAccountsLoaded', accountsLoaded)
    setContext<Readable<AccountMessage[]>>('walletTransactions', transactions)
    setContext<Readable<WalletAccount>>('selectedAccount', selectedAccount)
    setContext<Readable<BalanceHistory>>('accountsBalanceHistory', accountsBalanceHistory)
    setContext<Readable<BalanceHistory>>('walletBalanceHistory', walletBalanceHistory)

    let isGeneratingAddress = false
    let createAccountError = ''

    function getAccountMeta(
        accountId: string,
        callback: (
            error: ErrorEventPayload,
            meta?: {
                balance: number
                incoming: number
                outgoing: number
                depositAddress: string
            }
        ) => void
    ) {
        api.getBalance(accountId, {
            onSuccess(balanceResponse) {
                api.latestAddress(accountId, {
                    onSuccess(latestAddressResponse) {
                        callback(null, {
                            balance: balanceResponse.payload.total,
                            incoming: balanceResponse.payload.incoming,
                            outgoing: balanceResponse.payload.outgoing,
                            depositAddress: latestAddressResponse.payload.address,
                        })
                    },
                    onError(error) {
                        callback(error)
                    },
                })
            },
            onError(error) {
                callback(error)
            },
        })
    }

    function prepareAccountInfo(
        account: BaseAccount,
        meta: {
            balance: number
            incoming: number
            outgoing: number
            depositAddress: string
        }
    ): WalletAccount {
        const { id, index, alias } = account
        const { balance, depositAddress } = meta

        return Object.assign<WalletAccount, BaseAccount, Partial<WalletAccount>>({} as WalletAccount, account, {
            id,
            index,
            depositAddress,
            alias,
            rawIotaBalance: balance,
            balance: formatUnit(balance, 0),
            balanceEquiv: `${convertToFiat(
                balance,
                $currencies[CurrencyTypes.USD],
                $exchangeRates[get(activeProfile).settings.currency]
            )} ${$activeProfile.settings.currency}`,
            color: AccountColors[index],
        })
    }

    function getAccounts() {
        api.getAccounts({
            onSuccess(accountsResponse) {
                const _totalBalance = {
                    balance: 0,
                    incoming: 0,
                    outgoing: 0,
                }

                if (accountsResponse.payload.length === 0) {
                    accountsLoaded.set(true)
                } else {
                    for (const [idx, storedAccount] of accountsResponse.payload.entries()) {
                        getAccountMeta(storedAccount.id, (err, meta) => {
                            if (!err) {
                                _totalBalance.balance += meta.balance
                                _totalBalance.incoming += meta.incoming
                                _totalBalance.outgoing += meta.outgoing

                                const account = prepareAccountInfo(storedAccount, meta)
                                accounts.update((accounts) => [...accounts, account])

                                if (idx === accountsResponse.payload.length - 1) {
                                    updateBalanceOverview(_totalBalance.balance, _totalBalance.incoming, _totalBalance.outgoing)
                                    accountsLoaded.set(true)
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

    function syncAccounts(payload) {
        api.syncAccounts({
            onSuccess(syncAccountsResponse) {
                const syncedAccounts = syncAccountsResponse.payload

                updateAccounts(syncedAccounts)
            },
            onError(err) {
                showAppNotification({
                    type: 'error',
                    message: locale(err.error),
                })
            },
        })
    }

    function onCreateAccount(alias) {
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
                        api.syncAccount(createAccountResponse.payload.id, {
                            onSuccess(syncAccountResponse) {
                                getAccountMeta(createAccountResponse.payload.id, (err, meta) => {
                                    if (!err) {
                                        const account = prepareAccountInfo(createAccountResponse.payload, meta)
                                        accounts.update((accounts) => [...accounts, account])
                                        walletRoute.set(WalletRoutes.Init)
                                    } else {
                                        console.error(err)
                                    }
                                })
                            },
                            onError(err) {
                                console.error(err)
                            },
                        })
                    },
                    onError(err) {
                        createAccountError = locale(err.error)
                    },
                }
            )

        api.getStrongholdStatus({
            onSuccess(strongholdStatusResponse) {
                if (strongholdStatusResponse.payload.snapshot.status === 'Locked') {
                    openPopup({ type: 'password', props: { onSuccess: _create } })
                } else {
                    _create()
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
                            sendParams.set({ address: '', amount: 0, message: '' })
                            isTransferring.set(false)
                            walletRoute.set(WalletRoutes.Init)
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
                                            Object.assign({}, response.payload, {
                                            incoming: isReceiverAccount
                                        }), ..._account.messages],
                                    }
                                )
                            }

                            return _account
                        })
                    })

                    transferState.set('Complete')

                    setTimeout(() => {
                        sendParams.set({ address: '', amount: 0, message: '' })
                        isTransferring.set(false)
                        walletRoute.set(WalletRoutes.Init)
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
        if ($deepLinkRequestActive && get(activeProfile).settings.deepLinking) {
            walletRoute.set(WalletRoutes.Send)
            deepLinkRequestActive.set(false)
        }
    }

    onMount(() => {
        if (!$accountsLoaded) {
            getAccounts()
        }

        initialiseListeners()

        api.getStrongholdStatus({
            onSuccess(strongholdStatusResponse) {
                updateProfile('isStrongholdLocked', strongholdStatusResponse.payload.snapshot.status === 'Locked')
            },
            onError(error) {
                console.error(error)
            },
        })
    })
</script>

{#if $walletRoute === WalletRoutes.Account && $selectedAccountId}
    <Account
        {isGeneratingAddress}
        send={onSend}
        internalTransfer={onInternalTransfer}
        generateAddress={onGenerateAddress}
        {locale} />
{:else}
    <div class="w-full h-full flex flex-col p-10 flex-1">
        <div class="w-full h-full flex flex-row space-x-4 flex-auto">
            <DashboardPane classes="w-1/3 h-full">
                <!-- Total Balance, Accounts list & Send/Receive -->
                <div class="flex flex-auto flex-col flex-shrink-0 h-full">
                    {#if $walletRoute === WalletRoutes.CreateAccount}
                        <CreateAccount error={createAccountError} onCreate={onCreateAccount} {locale} />
                    {:else}
                        <WalletBalance {locale} />
                        <DashboardPane classes="-mt-5 h-full">
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
            <div class="flex flex-col w-2/3 h-full space-y-4">
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
