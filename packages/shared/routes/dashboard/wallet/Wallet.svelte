<script lang="typescript">
    import { Popup, DashboardPane } from 'shared/components'
    import { Account, WalletOverview, LineChart, WalletHistory, Security } from './views/'
    import { onMount } from 'svelte'
    import { api, getLatestMessages } from 'shared/lib/wallet'
 
    import { DEFAULT_NODE as node, DEFAULT_NODES as nodes } from 'shared/lib/network'
    import { formatUnit } from 'shared/lib/units'

    export let locale
    export let mobile

    const AccountColors = ['turquoise', 'green', 'orange', 'yellow', 'purple', 'pink']

    enum WalletState {
        Init = 'init',
        Account = 'account',
        Send = 'send',
        Receive = 'receive',
        CreateAccount = 'createAccount',
    }

    let totalBalance = {
          incoming: '32 Gi',
          outgoing: '16 Gi',
          balance: '0 Mi',
          balanceEquiv: '45.500 USD'
    }
    let transactions = []
    
    let accounts = []

    let state: WalletState = WalletState.Init
    let stateHistory = []

    let isGeneratingAddress = false

    let showPasswordPopup = false

    let selectedAccount = null

    const _next = (request) => {
        let nextState

        switch (state) {
            case WalletState.Init:
                if (Object.values(WalletState).includes(request as WalletState)) {
                    nextState = request
                }
                break
            case WalletState.Send:
                // do logic here
                nextState = WalletState.Init
                break
            case WalletState.Account:
            case WalletState.Send:
            case WalletState.CreateAccount:
                nextState = request
                break;
        }
        if (nextState) {
            stateHistory.push(state)
            stateHistory = stateHistory
            state = nextState
        }
    }
    
    const _previous = () => {
        let prevState = stateHistory.pop()
        if (prevState) {
            if (state === WalletState.Account) {
                selectedAccount = null
            }
            state = prevState
        }
    }

    const selectAccount = (index) => {
        selectedAccount = accounts.find((account) => account.index === index)
        if (selectedAccount) {
            _next('account')
        } else {
            console.error('Error selecting account')
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
                            address: latestAddressResponse.payload.address
                        })
                    },
                    onError(error) {
                        callback(error)
                    }
                })},
                onError(error) {
                    callback(error)
                }
        })
    }

    function prepareAccountInfo(account, meta) {
        const { id, index, alias } = account;
        const { balance, address } = meta;

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
                    outgoing: 0
                }

                for (const [idx, storedAccount] of accountsResponse.payload.entries()) {
                    getAccountMeta(storedAccount.id, (err, meta) => {
                        if (!err) {
                            _totalBalance.balance += meta.balance
                            _totalBalance.incoming += meta.incoming
                            _totalBalance.outgoing += meta.outgoing

                            const account = prepareAccountInfo(storedAccount, meta);
                            accounts = [...accounts, account]
                            transactions = getLatestMessages(accountsResponse.payload)

                             if (idx === accountsResponse.payload.length - 1) {
                                totalBalance = Object.assign({}, totalBalance, {
                                    balance: formatUnit(_totalBalance.balance, 2),
                                    incoming: formatUnit(_totalBalance.incoming, 2),
                                    outgoing: formatUnit(_totalBalance.outgoing, 2),
                                });
                            }
                        } else {
                            console.error(err);
                        }
                    })
                }

            },
            onError(error) {
                // TODO handle error
                console.error(error)
            }
        })
    }

    function onGenerateAddress(accountId) {
        isGeneratingAddress = true
        api.generateAddress(accountId, {
            onSuccess(response) {
            accounts = accounts.map((account) => {
                if (account.id === accountId) {
                    return Object.assign({}, account, {
                        address: response.payload.address
                    })
                }

                return account;
            })
            isGeneratingAddress = false
            },
            onError(error) {
                console.error(error)
            }
        })
    }

    function syncAccounts(payload) {
        api.syncAccounts({
            onSuccess(response) {},
            onError(error) {
                console.error(error)
            }
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
                            const account = prepareAccountInfo(createAccountResponse.payload, meta);
                            accounts = [...accounts, account]
                            _next(WalletState.Init)
                        } else {
                            console.error(err);
                        }
                    })
                        },
                        onError(error) {
                            console.error(error)
                        }
                    })
                },
                onError(error) {
                    console.error(error);
            }
         }
        )
    }

    function onSend(
        senderAccountId, 
        receiveAddress,
        amount,
        ) {
        api.send(
            senderAccountId,
            {
                amount,
                address: receiveAddress,
                remainder_value_strategy: {
                    strategy: 'ChangeAddress'
                },
                indexation: { index: 'firefly', data: new Array() }
            },
            {
                onSuccess(response) {
                    transactions = [{
                        ...response.payload,
                        ...{
                            internal: false,
                            account: accounts.find((account) => account.id === senderAccountId).index
                        },
                        ...transactions,
                    }]
                    _next(WalletState.Init)
                },
                onError(error) {
                    console.error(error);
                }
            }
        )
    }

    function onInternalTransfer(senderAccountId, receiverAccountId, amount) {
        api.internalTransfer(
                senderAccountId,
                receiverAccountId,
                amount,
                {
                    onSuccess(response) {
                         transactions = [{
                        ...response.payload,
                        ...{
                            internal: true,
                            account: accounts.find((account) => account.id === senderAccountId).index
                        },
                        ...transactions
                    }]
                        _next(WalletState.Init)
                    },
                    onError(response) {
                        console.log(response)
                    }
                }
            )
    } 

    onMount(() => {
      getAccounts();

      api.getStrongholdStatus({
          onSuccess(strongholdStatusResponse) {
              if (strongholdStatusResponse.payload.snapshot.status === 'Locked') {
                      api.areLatestAddressesUnused({
                        onSuccess(response) {
                            if (!response.payload) {
                                showPasswordPopup = true;
                            }
                        },
                        onError(error) {
                            console.error(error)
                        }
                     })
              }
          },
          onError(error) {
              console.error(error)
          }
      })
    })
</script>

<Popup
    bind:active={showPasswordPopup}
    {locale}
    type="password"
    title="Password required"
    subtitle="Please provide your wallet’s password to unlock stronghold." 
    onSuccess={syncAccounts}
/>
{#if state === WalletState.Account && selectedAccount}
    <Account
        send={onSend}
        internalTransfer={onInternalTransfer}
        account={selectedAccount}
        {accounts}
        {selectAccount}
        {locale}
        {mobile}
        transactions={transactions.filter((tx) => tx.account === selectedAccount.index)}
        on:previous={_previous} />
{:else}
    <div class="w-full h-full flex flex-col p-10">
        <div class="w-full h-full flex flex-row space-x-4 flex-auto">
            <DashboardPane classes="w-1/3 h-full">
                <WalletOverview
                    {locale}
                    {mobile}
                    {state}
                    {_next}
                    {_previous}
                    {accounts}
                    {totalBalance}
                    {selectAccount}
                    {WalletState} 
                    {onSend}
                    {onInternalTransfer}
                    {onGenerateAddress}/>
            </DashboardPane>            
            <!-- Portfolio / Token Chart, Latest Transactions, Security -->
            <div class="flex flex-col w-2/3 h-full space-y-4">
                <DashboardPane>
                    <LineChart />
                </DashboardPane>
                <div class="w-full flex flex-row flex-1 space-x-4">
                    <DashboardPane classes="w-1/2">
                        <WalletHistory {locale} {mobile} {transactions} {accounts} />
                    </DashboardPane>
                    <DashboardPane classes="w-1/2">
                        <Security {locale} {mobile} />
                    </DashboardPane>
                </div>
            </div>
        </div>
    </div>
{/if}
