<script lang="typescript">
    import { setContext, onMount } from 'svelte'
    import { get, derived } from 'svelte/store'
    import { updateProfile } from 'shared/lib/profile'
    import { api, getLatestMessages, initialiseListeners, selectedAccountId, wallet } from 'shared/lib/wallet'
    import { deepLinkRequestActive } from 'shared/lib/deepLinking'
    import { activeProfile } from 'shared/lib/profile'
    import { formatUnit } from 'shared/lib/units'
    import { DashboardPane } from 'shared/components'
    import { Account, LineChart, WalletHistory, Security, CreateAccount, WalletBalance, WalletActions } from './views/'
    import { convertToFiat, currencies, CurrencyTypes, exchangeRates } from 'shared/lib/currency'
    import { openPopup } from 'shared/lib/popup'
    import { walletViewState, WalletViewStates } from 'shared/lib/router'

    export let locale

    const AccountColors = ['turquoise', 'green', 'orange', 'yellow', 'purple', 'pink']

    const { accounts, balanceOverview } = $wallet

    const transactions = derived(accounts, ($accounts) => {
        return getLatestMessages($accounts)
    })
    const selectedAccount = derived([selectedAccountId, accounts], ([$selectedAccountId, $accounts]) =>
        $accounts.find((acc) => acc.id === $selectedAccountId)
    )

    setContext('walletBalance', balanceOverview)
    setContext('walletAccounts', accounts)
    setContext('walletTransactions', transactions)
    setContext('selectedAccount', selectedAccount)

    let isGeneratingAddress = false

    function getAccountMeta(accountId, callback) {
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

    function prepareAccountInfo(account, meta) {
        const { id, index, alias } = account
        const { balance, depositAddress } = meta

        return Object.assign({}, account, {
            id,
            index,
            depositAddress,
            name: alias,
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

                for (const [idx, storedAccount] of accountsResponse.payload.entries()) {
                    getAccountMeta(storedAccount.id, (err, meta) => {
                        if (!err) {
                            _totalBalance.balance += meta.balance
                            _totalBalance.incoming += meta.incoming
                            _totalBalance.outgoing += meta.outgoing

                            const account = prepareAccountInfo(storedAccount, meta)
                            accounts.update((accounts) => [...accounts, account])

                            if (idx === accountsResponse.payload.length - 1) {
                                balanceOverview.update((balanceOverview) =>
                                    Object.assign({}, balanceOverview, {
                                        incoming: formatUnit(_totalBalance.incoming, 2),
                                        incomingRaw: _totalBalance.incoming,
                                        outgoing: formatUnit(_totalBalance.outgoing, 2),
                                        outgoingRaw: _totalBalance.outgoing,
                                        balance: formatUnit(_totalBalance.balance, 2),
                                        balanceRaw: _totalBalance.balance,
                                        balanceFiat: `${convertToFiat(
                                            _totalBalance.balance,
                                            $currencies[CurrencyTypes.USD],
                                            $exchangeRates[$activeProfile.settings.currency]
                                        )} ${$activeProfile.settings.currency}`,
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
        const _generate = () => {
            isGeneratingAddress = true
            api.getUnusedAddress(accountId, {
                onSuccess(response) {
                    accounts.update((accounts) =>
                        accounts.map((account) => {
                            if (account.id === accountId) {
                                return Object.assign({}, account, {
                                    depositAddress: response.payload.address,
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
                        const syncedAccount = syncedAccounts.find((_account) => _account.id === storedAccount.id)

                        return Object.assign({}, storedAccount, {
                            // Update deposit address
                            depositAddress: syncedAccount.depositAddress.address,
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
                clientOptions: {
                    node: $accounts[0].clientOptions.node,
                    nodes: $accounts[0].clientOptions.nodes,
                    // For subsequent accounts, use the network for any of the previous accounts
                    network: $accounts[0].clientOptions.network,
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
                                    walletViewState.set(WalletViewStates.Init)
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
                        walletViewState.set(WalletViewStates.Init)
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
                    openPopup({ type: 'password', props: { onSuccess: _send } })
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
                    walletViewState.set(WalletViewStates.Init)
                },
                onError(response) {
                    console.error(response)
                },
            })
        }

        api.getStrongholdStatus({
            onSuccess(strongholdStatusResponse) {
                if (strongholdStatusResponse.payload.snapshot.status === 'Locked') {
                    openPopup({ type: 'password', props: { onSuccess: _internalTransfer } })
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

                walletViewState.set(WalletViewStates.Init)
            },
            onError(error) {
                console.error(error)
            },
        })
    }

    $: {
        if ($deepLinkRequestActive && get(activeProfile).settings.deepLinking) {
            walletViewState.set(WalletViewStates.Send)
            deepLinkRequestActive.set(false)
        }
    }

    onMount(() => {
        if (!$accounts.length) {
            getAccounts()
        }

        initialiseListeners()

        api.getStrongholdStatus({
            onSuccess(strongholdStatusResponse) {
                updateProfile('isStrongholdLocked', strongholdStatusResponse.payload.snapshot.status === 'Locked')
                api.areLatestAddressesUnused({
                    onSuccess(response) {
                        if (!response.payload) {
                            openPopup({ type: 'password', props: { onSuccess: syncAccounts } })
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

{#if $walletViewState === WalletViewStates.Account && $selectedAccountId}
    <Account
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
                    {#if $walletViewState === WalletViewStates.CreateAccount}
                        <CreateAccount onCreate={onCreateAccount} {locale} />
                    {:else}
                        <WalletBalance {locale} />
                        <DashboardPane classes="-mt-5 h-full">
                            <WalletActions
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
