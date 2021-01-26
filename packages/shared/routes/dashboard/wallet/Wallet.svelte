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
    import { writable, derived } from 'svelte/store'
    import { api, getLatestMessages } from 'shared/lib/wallet'
    import { DEFAULT_NODE as node, DEFAULT_NODES as nodes } from 'shared/lib/network'
    import { formatUnit } from 'shared/lib/units'
    import { Popup, DashboardPane } from 'shared/components'
    import { Account, LineChart, WalletHistory, Security, CreateAccount, WalletBalance, WalletActions } from './views/'

    export let locale

    const AccountColors = ['turquoise', 'green', 'orange', 'yellow', 'purple', 'pink']
    const DUMMY_WALLET_BALANCE = {
        incoming: '32 Gi',
        outgoing: '16 Gi',
        balance: '0 Mi',
        balanceEquiv: '45.500 USD',
    }

    const totalBalance = writable(DUMMY_WALLET_BALANCE)
    const accounts = writable([])
    const transactions = writable([])
    const selectedAccountId = writable(null)
    const selectedAccount = derived([selectedAccountId, accounts], ([$selectedAccountId, $accounts]) =>
        $accounts.find((acc) => acc.id === $selectedAccountId)
    )
    const showPasswordPopup = writable(false)
    const state = writable(WalletState.Init)

    setContext('walletBalance', totalBalance)
    setContext('walletAccounts', accounts)
    setContext('walletTransactions', transactions)
    setContext('selectedAccountId', selectedAccountId)
    setContext('selectedAccount', selectedAccount)
    setContext('walletState', state)
    setContext('showPasswordPopup', showPasswordPopup)

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
            balanceEquiv: `${balance} USD`,
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
                            transactions.set(getLatestMessages(accountsResponse.payload))

                            if (idx === accountsResponse.payload.length - 1) {
                                totalBalance.update((totalBalance) =>
                                    Object.assign({}, totalBalance, {
                                        balance: formatUnit(_totalBalance.balance, 2),
                                        incoming: formatUnit(_totalBalance.incoming, 2),
                                        outgoing: formatUnit(_totalBalance.outgoing, 2),
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
            onSuccess(response) {},
            onError(error) {
                console.error(error)
            },
        })
    }

    function onCreateAccount(alias) {
        api.createAccount(
            {
                alias,
                clientOptions: { node, nodes },
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
                    transactions.update((transactions) => [
                        {
                            ...response.payload,
                            ...{
                                internal: false,
                                account: $accounts.find((account) => account.id === senderAccountId).index,
                            },
                            ...transactions,
                        },
                    ])
                    _next(WalletState.Init)
                },
                onError(error) {
                    console.error(error)
                },
            }
        )
    }

    function onInternalTransfer(senderAccountId, receiverAccountId, amount) {
        api.internalTransfer(senderAccountId, receiverAccountId, amount, {
            onSuccess(response) {
                transactions.update((transactions) => [
                    {
                        ...response.payload,
                        ...{
                            internal: true,
                            account: $accounts.find((account) => account.id === senderAccountId).index,
                        },
                        ...transactions,
                    },
                ])
                _next(WalletState.Init)
            },
            onError(response) {
                console.log(response)
            },
        })
    }

    onMount(() => {
        getAccounts()

        api.getStrongholdStatus({
            onSuccess(strongholdStatusResponse) {
                if (strongholdStatusResponse.payload.snapshot.status === 'Locked') {
                    api.areLatestAddressesUnused({
                        onSuccess(response) {
                            if (!response.payload) {
                                showPasswordPopup.set(true)
                            }
                        },
                        onError(error) {
                            console.error(error)
                        },
                    })
                }
            },
            onError(error) {
                console.error(error)
            },
        })
    })
</script>

<Popup
    bind:active={$showPasswordPopup}
    {locale}
    type="password"
    title={locale('popups.password.title')}
    subtitle={locale('popups.password.subtitle')}
    onSuccess={syncAccounts} />
{#if $state === WalletState.Account && $selectedAccountId}
    <Account
        on:next={_next}
        on:previous={_previous}
        send={onSend}
        internalTransfer={onInternalTransfer}
        generateAddress={onGenerateAddress}
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
                <DashboardPane classes="w-full">
                    <LineChart />
                </DashboardPane>
                <div class="w-full flex flex-row flex-1 space-x-4">
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
