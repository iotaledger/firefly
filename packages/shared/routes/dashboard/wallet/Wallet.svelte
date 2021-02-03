<script context="module" lang="typescript">
    export enum WalletState {
        Init = 'init',
        Account = 'account',
        Send = 'send',
        Receive = 'receive',
        CreateAccount = 'createAccount',
    }
</script>

<script lang="typescript">
    import { setContext, onMount } from 'svelte'
    import { get, writable, derived } from 'svelte/store'
    import { updateStrongholdStatus } from 'shared/lib/app'
    import { api, getLatestMessages, initialiseListeners } from 'shared/lib/wallet'
    import { deepLinkRequestActive } from 'shared/lib/deepLinking'
    import { deepLinking, currency } from 'shared/lib/settings'
    import { DEFAULT_NODES as nodes } from 'shared/lib/network'
    import { formatUnit } from 'shared/lib/units'
    import { Popup, DashboardPane } from 'shared/components'
    import { Account, LineChart, WalletHistory, Security, CreateAccount, WalletBalance, WalletActions } from './views/'
    import { convertToFiat, currencies, CurrencyTypes, exchangeRates } from 'shared/lib/currency'

    export let locale

    const AccountColors = ['turquoise', 'green', 'orange', 'yellow', 'purple', 'pink']
    const DUMMY_WALLET_BALANCE = {
        incoming: '32 Gi',
        outgoing: '16 Gi',
        balance: '0 Mi',
        balanceEquiv: '0.00 USD',
    }

    const totalBalance = writable(DUMMY_WALLET_BALANCE)
    const accounts = writable([])
    const transactions = derived(accounts, ($accounts) => {
        return getLatestMessages($accounts)
    })
    const selectedAccountId = writable(null)
    const selectedAccount = derived([selectedAccountId, accounts], ([$selectedAccountId, $accounts]) =>
        $accounts.find((acc) => acc.id === $selectedAccountId)
    )
    const state = writable(WalletState.Init)
    const popupState = writable({ active: false })

    setContext('walletBalance', totalBalance)
    setContext('walletAccounts', accounts)
    setContext('walletTransactions', transactions)
    setContext('selectedAccountId', selectedAccountId)
    setContext('selectedAccount', selectedAccount)
    setContext('walletState', state)
    setContext('popupState', popupState)

    let stateHistory = []
    let isGeneratingAddress = false

    const _next = (request) => {
        let nextState
        if (request instanceof CustomEvent) {
            request = request.detail || {}
        }
        if (Object.values(WalletState).includes(request as WalletState)) {
            nextState = request
        } else {
            switch ($state) {
                case WalletState.Account:
                case WalletState.Init:
                    const { accountId } = request
                    if (accountId) {
                        const account = $accounts.find((account) => account.id === accountId)
                        if (account) {
                            selectedAccountId.set(accountId)
                            _next(WalletState.Account)
                        } else {
                            console.error('Error selecting account')
                        }
                    }
                    break
                case WalletState.Send:
                    // do logic here
                    nextState = WalletState.Init
                    break
            }
        }
        if (nextState) {
            if (nextState !== $state) {
                stateHistory.push($state)
            }
            stateHistory = stateHistory
            state.set(nextState)
        }
    }
    const _previous = () => {
        let prevState = stateHistory.pop()
        if (prevState) {
            if ($state === WalletState.Account) {
                selectedAccountId.set(null)
            }
            state.set(prevState)
        }
    }

    function getAccountMeta(accountId, callback) {
        api.getBalance(accountId, {
            onSuccess(balanceResponse) {
                api.latestAddress(accountId, {
                    onSuccess(latestAddressResponse) {
                        callback(null, {
                            balance: balanceResponse.payload.total,
                            incoming: balanceResponse.payload.incoming,
                            outgoing: balanceResponse.payload.outgoing,
                            address: latestAddressResponse.payload.address,
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

    function prepareAccountInfo(account, meta) {
        const { id, index, alias } = account
        const { balance, address } = meta

        return Object.assign({}, account, {
            id,
            index,
            name: alias,
            balance: formatUnit(balance, 0),
            balanceEquiv: `${convertToFiat(balance, $currencies[CurrencyTypes.USD], $exchangeRates[$currency])} ${$currency}`,
            address,
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

                for (const [idx, storedAccount] of accountsResponse.payload.entries()) {
                    getAccountMeta(storedAccount.id, (err, meta) => {
                        if (!err) {
                            _totalBalance.balance += meta.balance
                            _totalBalance.incoming += meta.incoming
                            _totalBalance.outgoing += meta.outgoing

                            const account = prepareAccountInfo(storedAccount, meta)
                            accounts.update((accounts) => [...accounts, account])

                            if (idx === accountsResponse.payload.length - 1) {
                                totalBalance.update((totalBalance) =>
                                    Object.assign({}, totalBalance, {
                                        balance: formatUnit(_totalBalance.balance, 2),
                                        incoming: formatUnit(_totalBalance.incoming, 2),
                                        outgoing: formatUnit(_totalBalance.outgoing, 2),
                                        balanceEquiv: `${convertToFiat(
                                            _totalBalance.balance,
                                            $currencies[CurrencyTypes.USD],
                                            $exchangeRates[$currency]
                                        )} ${$currency}`,
                                    })
                                )
                            }
                        } else {
                            console.error(err)
                        }
                    })
                }
            },
            onError(error) {
                // TODO handle error
                console.error(error)
            },
        })
    }

    function onGenerateAddress(accountId) {
        isGeneratingAddress = true
        api.generateAddress(accountId, {
            onSuccess(response) {
                accounts.update((accounts) =>
                    accounts.map((account) => {
                        if (account.id === accountId) {
                            return Object.assign({}, account, {
                                address: response.payload.address,
                            })
                        }

                        return account
                    })
                )
                isGeneratingAddress = false
            },
            onError(error) {
                console.error(error)
            },
        })
    }

    function syncAccounts(payload) {
        api.syncAccounts({
            onSuccess(syncAccountsResponse) {
                const _update = (existingPayload, newPayload, prop) => {
                    const existingPayloadMap = existingPayload.reduce((acc, object) => {
                        acc[object[prop]] = object

                        return acc
                    }, {})

                    const newPayloadMap = newPayload.reduce((acc, object) => {
                        acc[object[prop]] = object

                        return acc
                    }, {})

                    return Object.values(Object.assign({}, existingPayloadMap, newPayloadMap))
                }

                const syncedAccounts = syncAccountsResponse.payload

                accounts.update((storedAccounts) => {
                    return storedAccounts.map((storedAccount) => {
                        // TODO: SyncAccounts response should have "id" instead of "accountId" (for consistency)
                        const syncedAccount = syncedAccounts.find((_account) => _account.accountId === storedAccount.id)

                        return Object.assign({}, storedAccount, {
                            // Update deposit address
                            depositAddress: syncedAccount.depositAddress,
                            // If we have received a new address, simply add it;
                            // If we have received an existing address, update the properties.
                            addresses: _update(storedAccount.addresses, syncedAccount.addresses, 'address'),
                            messages: _update(storedAccount.messages, syncedAccount.messages, 'id'),
                        })
                    })
                })
            },
            onError(error) {
                console.error(error)
            },
        })
    }

    function onCreateAccount(alias) {
        api.createAccount(
            {
                alias,
                // For subsequent accounts, use the network for any of the previous accounts
                clientOptions: { nodes, network: $accounts[0].clientOptions.network },
            },
            {
                onSuccess(createAccountResponse) {
                    api.syncAccount(createAccountResponse.payload.id, {
                        onSuccess(syncAccountResponse) {
                            getAccountMeta(createAccountResponse.payload.id, (err, meta) => {
                                if (!err) {
                                    const account = prepareAccountInfo(createAccountResponse.payload, meta)
                                    accounts.update((accounts) => [...accounts, account])
                                    _next(WalletState.Init)
                                } else {
                                    console.error(err)
                                }
                            })
                        },
                        onError(error) {
                            console.error(error)
                        },
                    })
                },
                onError(error) {
                    console.error(error)
                },
            }
        )
    }

    function onSend(senderAccountId, receiveAddress, amount) {
        const _send = () => {
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
                                    return Object.assign({}, _account, {
                                        messages: [response.payload, ..._account.messages],
                                    })
                                }

                                return _account
                            })
                        })
                        _next(WalletState.Init)
                    },
                    onError(error) {
                        console.error(error)
                    },
                }
            )
        }

        api.getStrongholdStatus({
            onSuccess(strongholdStatusResponse) {
                if (strongholdStatusResponse.payload.snapshot.status === 'Locked') {
                    popupState.set({ active: true, type: 'password', props: { onSuccess: _send } })
                }
            },
            onError(error) {
                console.error(error)
            },
        })
    }

    function onInternalTransfer(senderAccountId, receiverAccountId, amount) {
        const _internalTransfer = () => {
            api.internalTransfer(senderAccountId, receiverAccountId, amount, {
                onSuccess(response) {
                    accounts.update((_accounts) => {
                        return _accounts.map((_account) => {
                            if (_account.id === senderAccountId || _account.id === receiverAccountId) {
                                return Object.assign({}, _account, {
                                    messages: [response.payload, ..._account.messages],
                                })
                            }

                            return _account
                        })
                    })
                    _next(WalletState.Init)
                },
                onError(response) {
                    console.error(response)
                },
            })
        }

        api.getStrongholdStatus({
            onSuccess(strongholdStatusResponse) {
                if (strongholdStatusResponse.payload.snapshot.status === 'Locked') {
                    popupState.set({ active: true, type: 'password', props: { onSuccess: _internalTransfer } })
                }
            },
            onError(error) {
                console.error(error)
            },
        })
    }

    function onSetAlias(newAlias) {
        api.setAlias($selectedAccountId, newAlias, {
            onSuccess(res) {
                accounts.update((_accounts) => {
                    return _accounts.map((account) => {
                        if (account.id === $selectedAccountId) {
                            return Object.assign({}, account, {
                                // TODO: Remove "name" property from account and reference alias everywhere
                                alias: newAlias,
                                name: newAlias,
                            })
                        }

                        return account
                    })
                })

                _next(WalletState.Init)
            },
            onError(error) {
                console.error(error)
            },
        })
    }

    $: {
        if ($deepLinkRequestActive && get(deepLinking)) {
            _next(WalletState.Send)
            deepLinkRequestActive.set(false)
        }
    }

    onMount(() => {
        getAccounts()

        initialiseListeners()

        api.getStrongholdStatus({
            onSuccess(strongholdStatusResponse) {
                updateStrongholdStatus(strongholdStatusResponse.payload.snapshot.status === 'Locked')

                api.areLatestAddressesUnused({
                    onSuccess(response) {
                        if (!response.payload) {
                            popupState.set({ active: true, type: 'password', props: { onSuccess: syncAccounts } })
                        }
                    },
                    onError(error) {
                        console.error(error)
                    },
                })
            },
            onError(error) {
                console.error(error)
            },
        })
    })
</script>

{#if $popupState.active}
    <Popup type={$popupState.type} props={$popupState.props} {locale} />
{/if}
{#if $state === WalletState.Account && $selectedAccountId}
    <Account
        on:next={_next}
        on:previous={_previous}
        send={onSend}
        internalTransfer={onInternalTransfer}
        generateAddress={onGenerateAddress}
        setAlias={onSetAlias}
        {locale} />
{:else}
    <div class="w-full h-full flex flex-col p-10">
        <div class="w-full h-full flex flex-row space-x-4 flex-auto">
            <DashboardPane classes="w-1/3 h-full">
                <!-- Total Balance, Accounts list & Send/Receive -->
                <div class="flex flex-auto flex-col flex-shrink-0 h-full">
                    {#if $state === WalletState.CreateAccount}
                        <CreateAccount on:next={_next} on:previous={_previous} onCreate={onCreateAccount} {locale} />
                    {:else}
                        <WalletBalance {locale} />
                        <DashboardPane classes="-mt-5 h-full">
                            <WalletActions
                                on:next={_next}
                                on:previous={_previous}
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
                    <LineChart />
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
