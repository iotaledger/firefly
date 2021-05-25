<script lang="typescript">
    import { DashboardPane } from 'shared/components'
    import { clearSendParams } from 'shared/lib/app'
    import { deepCopy } from 'shared/lib/helpers'
    import { addProfileCurrencyPriceData, priceData } from 'shared/lib/marketData'
    import { showAppNotification } from 'shared/lib/notifications'
    import { openPopup } from 'shared/lib/popup'
    import {
        activeProfile,
        isSoftwareProfile,
        isStrongholdLocked,
        MigratedTransaction,
        setMissingProfileType,
        updateProfile,
    } from 'shared/lib/profile'
    import { walletRoute } from 'shared/lib/router'
    import type { Transaction } from 'shared/lib/typings/message'
    import { WalletRoutes } from 'shared/lib/typings/routes'
    import {
        AccountMessage,
        AccountsBalanceHistory,
        api,
        asyncSyncAccounts,
        BalanceHistory,
        BalanceOverview,
        getAccountMessages,
        getAccountMeta,
        getAccountsBalanceHistory,
        getIncomingFlag,
        getInternalFlag,
        getTransactions,
        getWalletBalanceHistory,
        initialiseListeners,
        isSelfTransaction,
        isTransferring,
        prepareAccountInfo,
        processMigratedTransactions,
        removeEventListeners,
        selectedAccountId,
        setIncomingFlag,
        transferState,
        updateBalanceOverview,
        wallet,
        WalletAccount,
    } from 'shared/lib/wallet'
    import { onMount, setContext } from 'svelte'
    import { derived, Readable, Writable } from 'svelte/store'
    import { Account, CreateAccount, LineChart, Security, WalletActions, WalletBalance, WalletHistory } from './views/'

    export let locale

    const { accounts, balanceOverview, accountsLoaded, internalTransfersInProgress } = $wallet

    const accountsBalanceHistory = derived([accounts, priceData], ([$accounts, $priceData]) =>
        getAccountsBalanceHistory($accounts, $priceData)
    )
    const walletBalanceHistory = derived(accountsBalanceHistory, ($accountsBalanceHistory) =>
        getWalletBalanceHistory($accountsBalanceHistory)
    )
    const selectedAccount = derived([selectedAccountId, accounts], ([$selectedAccountId, $accounts]) =>
        $accounts.find((acc) => acc.id === $selectedAccountId)
    )
    const accountTransactions = derived([selectedAccount], ([$selectedAccount]) => {
        return $selectedAccount ? getAccountMessages($selectedAccount) : []
    })

    const viewableAccounts: Readable<WalletAccount[]> = derived([activeProfile, accounts], ([$activeProfile, $accounts]) => {
        if (!$activeProfile) {
            return []
        }

        if ($activeProfile.settings.showHiddenAccounts) {
            let sortedAccounts = $accounts.sort((a, b) => a.index - b.index)

            // If the last account is "hidden" and has no value, messages or history treat it as "deleted"
            // This account will get re-used if someone creates a new one
            if (sortedAccounts.length > 1 && $activeProfile.hiddenAccounts) {
                const lastAccount = sortedAccounts[sortedAccounts.length - 1]
                if (
                    $activeProfile.hiddenAccounts.includes(lastAccount.id) &&
                    lastAccount.rawIotaBalance === 0 &&
                    lastAccount.messages.length === 0
                ) {
                    sortedAccounts.pop()
                }
            }

            return sortedAccounts
        }

        return $accounts.filter((a) => !$activeProfile.hiddenAccounts?.includes(a.id)).sort((a, b) => a.index - b.index)
    })

    const liveAccounts: Readable<WalletAccount[]> = derived([activeProfile, accounts], ([$activeProfile, $accounts]) => {
        if (!$activeProfile) {
            return []
        }
        return $accounts.filter((a) => !$activeProfile.hiddenAccounts?.includes(a.id)).sort((a, b) => a.index - b.index)
    })

    const transactions = derived([viewableAccounts, activeProfile], ([$viewableAccounts, $activeProfile]) => {
        if ($activeProfile?.migratedTransactions?.length) {
            return $activeProfile.migratedTransactions
        }
        return getTransactions($viewableAccounts)
    })

    setContext<Writable<BalanceOverview>>('walletBalance', balanceOverview)
    setContext<Writable<WalletAccount[]>>('walletAccounts', accounts)
    setContext<Readable<WalletAccount[]>>('viewableAccounts', viewableAccounts)
    setContext<Readable<WalletAccount[]>>('liveAccounts', liveAccounts)
    setContext<Writable<boolean>>('walletAccountsLoaded', accountsLoaded)
    setContext<Readable<AccountMessage[] | MigratedTransaction[]>>('walletTransactions', transactions)
    setContext<Readable<WalletAccount>>('selectedAccount', selectedAccount)
    setContext<Readable<AccountsBalanceHistory>>('accountsBalanceHistory', accountsBalanceHistory)
    setContext<Readable<AccountMessage[]>>('accountTransactions', accountTransactions)
    setContext<Readable<BalanceHistory>>('walletBalanceHistory', walletBalanceHistory)

    let isGeneratingAddress = false

    $: if ($accountsLoaded) {
        // update profileType if it is missing
        if (!$activeProfile?.profileType) {
            setMissingProfileType($accounts)
        }
    }

    function getAccounts() {
        api.getAccounts({
            onSuccess(accountsResponse) {
                const _continue = async () => {
                    accountsLoaded.set(true)
                    const gapLimit = $activeProfile?.gapLimit ?? 10
                    try {
                        await asyncSyncAccounts(0, gapLimit, 1, false)
                    } catch (err) {
                        console.error(err)
                    }
                    updateProfile('gapLimit', 10)
                }

                if (accountsResponse.payload.length === 0) {
                    _continue()
                } else {
                    const totalBalance = {
                        balance: 0,
                        incoming: 0,
                        outgoing: 0,
                    }

                    let completeCount = 0
                    let newAccounts = []
                    for (const payloadAccount of accountsResponse.payload) {
                        // Only keep messages with a payload
                        payloadAccount.messages = payloadAccount.messages.filter((m) => m.payload)

                        // The wallet only returns one side of internal transfers
                        // to the same account, so create the other side by first finding
                        // the internal messages
                        const internalMessages = payloadAccount.messages.filter((m) => getInternalFlag(m.payload))

                        for (const internalMessage of internalMessages) {
                            // Check if the message sends to another address in the same account
                            const isSelf = isSelfTransaction(internalMessage.payload, payloadAccount)

                            if (isSelf) {
                                // It's a transfer between two addresses in the same account
                                // Try and find the other side of the pair where the message id
                                // would be the same and the incoming flag the opposite
                                const internalIncoming = getIncomingFlag(internalMessage.payload)
                                let pair = internalMessages.find(
                                    (m) => m.id === internalMessage.id && getIncomingFlag(m.payload) !== internalIncoming
                                )

                                // Can't find the other side of the pair so clone the original
                                // reverse its incoming flag and store it
                                if (!pair) {
                                    pair = deepCopy(internalMessage)
                                    // Reverse the incoming flag for the other side of the pair
                                    setIncomingFlag(pair.payload, !getIncomingFlag(pair.payload))
                                    payloadAccount.messages.push(pair)
                                }
                            }
                        }

                        getAccountMeta(payloadAccount.id, (err, meta) => {
                            if (!err) {
                                totalBalance.balance += meta.balance
                                totalBalance.incoming += meta.incoming
                                totalBalance.outgoing += meta.outgoing

                                const account = prepareAccountInfo(payloadAccount, meta)
                                newAccounts.push(account)
                            } else {
                                console.error(err)
                            }

                            completeCount++

                            if (completeCount === accountsResponse.payload.length) {
                                accounts.update((accounts) => [...accounts, ...newAccounts].sort((a, b) => a.index - b.index))
                                processMigratedTransactions(payloadAccount.id, payloadAccount.messages, payloadAccount.addresses)
                                updateBalanceOverview(totalBalance.balance, totalBalance.incoming, totalBalance.outgoing)
                                _continue()
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
                                account.depositAddress = response.payload.address

                                if (!account.addresses.some((a) => a.address === response.payload.address)) {
                                    account.addresses.push(response.payload)
                                }
                            }

                            return account
                        })
                    )
                    isGeneratingAddress = false
                },
                onError(err) {
                    isGeneratingAddress = false

                    const shouldHideErrorNotification =
                        err && err.type === 'ClientError' && err.error === 'error.node.chrysalisNodeInactive'

                    if (!shouldHideErrorNotification) {
                        showAppNotification({
                            type: 'error',
                            message: locale(err.error),
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
            _generate()
        }
    }

    function findReuseAccount() {
        // If the last account in the accounts list is "deleted" and has no
        // messages on it, we can reuse it, otherwise the wallet will complain
        // about the last account not being used
        const hiddenAccounts = $activeProfile?.hiddenAccounts ?? []

        if (hiddenAccounts.length > 0) {
            const lastAccount = $accounts[$accounts.length - 1]
            const hiddenAccountIndex = hiddenAccounts.indexOf(lastAccount.id)
            if (
                hiddenAccountIndex >= 0 &&
                lastAccount.rawIotaBalance === 0 &&
                lastAccount.messages &&
                lastAccount.messages.length === 0
            ) {
                return lastAccount.id
            }

            // If we have restarted the app we might not have been notified of the empty account
            // so it wont appear in the accounts list, so check in the hidden list to see
            // if there is an id not in the accounts list
            for (const hiddenAccount of hiddenAccounts) {
                if (!$accounts.some((a) => a.id === hiddenAccount)) {
                    return hiddenAccount
                }
            }
        }
    }

    function onCreateAccount(alias, completeCallback) {
        const _create = () => {
            const reuseAccountId = findReuseAccount()
            if (reuseAccountId) {
                api.setAlias(reuseAccountId, alias, {
                    onSuccess() {
                        let hasUpdated = false
                        accounts.update((_accounts) => {
                            return _accounts.map((account) => {
                                if (account.id === reuseAccountId) {
                                    hasUpdated = true
                                    return Object.assign<WalletAccount, WalletAccount, Partial<WalletAccount>>(
                                        {} as WalletAccount,
                                        account,
                                        {
                                            alias,
                                        }
                                    )
                                }

                                return account
                            })
                        })

                        // We didn't have the account in the list to update
                        // so we need to retrieve the details from the wallet manually
                        if (!hasUpdated) {
                            api.getAccounts({
                                onSuccess(accountsResponse) {
                                    const ac = accountsResponse.payload.find((a) => a.id === reuseAccountId)
                                    if (ac) {
                                        getAccountMeta(reuseAccountId, (err, meta) => {
                                            if (!err) {
                                                const account = prepareAccountInfo(ac, meta)
                                                accounts.update((accounts) => [...accounts, account])
                                            }
                                        })
                                    }
                                },
                                onError() {},
                            })
                        }

                        const hiddenAccounts = ($activeProfile?.hiddenAccounts ?? []).filter((a) => a !== reuseAccountId)
                        updateProfile('hiddenAccounts', hiddenAccounts)

                        walletRoute.set(WalletRoutes.Init)
                        completeCallback()
                    },
                    onError(err) {
                        completeCallback(locale(err.error))
                    },
                })
            } else {
                api.createAccount(
                    {
                        alias,
                        signerType: $accounts[0].signerType,
                        clientOptions: $accounts[0].clientOptions,
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
            }
        }

        if ($isSoftwareProfile) {
            api.getStrongholdStatus({
                onSuccess(strongholdStatusResponse) {
                    if (strongholdStatusResponse.payload.snapshot.status === 'Locked') {
                        openPopup({ type: 'password', props: { onSuccess: _create } })
                    } else {
                        _create()
                    }
                },
                onError(error) {
                    console.error(error)
                },
            })
        } else {
            _create()
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

        if ($isSoftwareProfile) {
            api.getStrongholdStatus({
                onSuccess(strongholdStatusResponse) {
                    if (strongholdStatusResponse.payload.snapshot.status === 'Locked') {
                        openPopup({ type: 'password', props: { onSuccess: _send } })
                    } else {
                        _send()
                    }
                },
                onError(error) {
                    console.error(error)
                },
            })
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

                    accounts.update((_accounts) => {
                        return _accounts.map((_account) => {
                            if (_account.id === senderAccountId) {
                                const m = deepCopy(message)
                                const mPayload = m.payload as Transaction
                                mPayload.data.essence.data.incoming = false
                                mPayload.data.essence.data.internal = true
                                _account.messages.push(m)
                            }
                            if (_account.id === receiverAccountId) {
                                const m = deepCopy(message)
                                const mPayload = m.payload as Transaction
                                mPayload.data.essence.data.incoming = true
                                mPayload.data.essence.data.internal = true
                                _account.messages.push(m)
                            }

                            return _account
                        })
                    })

                    transferState.set('Complete')

                    setTimeout(() => {
                        clearSendParams(internal)
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

    onMount(async () => {
        // If we are in settings when logged out the router reset
        // switches back to the wallet, but there is no longer
        // an active profile, only init if there is a profile
        if ($activeProfile) {
            if (!$accountsLoaded) {
                getAccounts()
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

            addProfileCurrencyPriceData()
        }
    })

    function checkStrongholdStatus() {
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
    }
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
