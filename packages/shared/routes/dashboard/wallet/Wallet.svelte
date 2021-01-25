<script lang="typescript">
    import { onMount } from 'svelte'
    import { api, getLatestMessages } from 'shared/lib/wallet'
    import type { account } from 'lib/typings'
    import { Dropdown, Icon, ActivityRow, Chart, Text, Button, AccountTile, Popup } from 'shared/components'
    import {
        selectedChart,
        CurrencyTypes,
        chartCurrency,
        chartTimeframe,
        TIMEFRAME_MAP,
        AvailableCharts,
    } from 'shared/lib/marketData'
    import { Send, Receive, Account, CreateAccount } from './views/'
    import { DEFAULT_NODE as node, DEFAULT_NODES as nodes } from 'shared/lib/network'
    import { format as formatUnits } from 'shared/lib/units'

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
          balance: '23.322,32 Mi',
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
        api.totalBalance(accountId, {
            onSuccess(availableBalanceResponse) {

                api.latestAddress(accountId, {
                    onSuccess(latestAddressResponse) {
                        callback(null, {
                            balance: availableBalanceResponse.payload,
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
            balance: formatUnits(balance, 0), 
            balanceEquiv: `${balance} USD`,
            address,
            color: AccountColors[index],
        })
    }

    function getAccounts() {
      api.getAccounts({
            onSuccess(accountsResponse) {
                for (const [idx, storedAccount] of accountsResponse.payload.entries()) {
                    getAccountMeta(storedAccount.id, (err, meta) => {
                        if (!err) {
                            const account = prepareAccountInfo(storedAccount, meta);
                            accounts = [...accounts, account]
                            transactions = getLatestMessages(accountsResponse.payload)
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
        console.log('payload', payload);

        api.syncAccounts({
            onSuccess(response) {
                console.log('Response', response);
                getAccounts();
            },
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
      api.getStrongholdStatus({
          onSuccess(response) {
              if (response.payload.snapshot.status === 'Locked') {
                  showPasswordPopup = true;
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
            <!-- Total Balance, Accounts list & Send/Receive -->
            <div class="flex flex-auto flex-col w-1/3 h-full flex-shrink-0">
                {#if state === WalletState.CreateAccount}
                    <CreateAccount on:next={_next} on:previous={_previous} {locale} {mobile} onCreate={onCreateAccount} />
                {:else}
                    <div
                        class="bg-gradient-to-b from-blue-500 to-blue-600 dark:from-gray-800 dark:to-gray-900 rounded-t-2xl pt-10 pb-12 px-8">
                        <!-- Balance -->
                        <div data-label="total-balance">
                            <Text type="p" overrideColor smaller classes="text-white mb-2">
                                {locale('general.total_balance')}
                            </Text>
                            <Text type="h2" overrideColor classes="text-white mb-2">{totalBalance.balance}</Text>
                            <Text type="p" overrideColor smaller classes="text-blue-300">{totalBalance.balanceEquiv}</Text>
                        </div>
                        {#if state === WalletState.Init}
                            <!-- Incoming/Outgoing -->
                            <div data-label="total-movements" class="flex flex-row justify-between mt-10">
                                <div class="flex items-center">
                                    <Icon
                                        boxed
                                        icon="arrow-down"
                                        classes="text-white"
                                        boxClasses="bg-blue-300 dark:bg-gray-900 mr-4" />
                                    <div>
                                        <Text type="p" classes="text-white mb-0.5">{totalBalance.incoming}</Text>
                                        <Text type="p" overrideColor smaller classes="text-blue-300">
                                            {locale('general.incoming')}
                                        </Text>
                                    </div>
                                </div>
                                <div class="flex items-center">
                                    <Icon
                                        boxed
                                        icon="arrow-up"
                                        classes="text-white"
                                        boxClasses="bg-blue-300 dark:bg-gray-900 mr-4" />
                                    <div>
                                        <Text type="p" classes="text-white mb-0.5">{totalBalance.outgoing}</Text>
                                        <Text type="p" overrideColor smaller classes="text-blue-300">
                                            {locale('general.outgoing')}
                                        </Text>
                                    </div>
                                </div>
                            </div>
                        {/if}
                    </div>
                    <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 pt-4 -mt-5 flex flex-col h-full justify-between">
                        <!-- Accounts -->
                        {#if state === WalletState.Init || state === WalletState.Account}
                            {#if state === WalletState.Init || state === WalletState.Account}
                                <div data-label="accounts">
                                    <div class="flex flex-row mb-6 justify-between items-center">
                                        <Text type="h5">{locale('general.accounts')}</Text>
                                        <Button onClick={() => _next(WalletState.CreateAccount)} secondary small icon="plus">
                                            Create
                                        </Button>
                                    </div>
                                    {#if accounts.length > 0}
                                        <div class="flex flex-row justify-between flex-wrap w-full px-2">
                                            {#each accounts as account, i}
                                                <AccountTile
                                                    color={account.color}
                                                    name={account.name}
                                                    balance={account.balance}
                                                    balanceEquiv={account.balanceEquiv}
                                                    width={accounts.length === 1 ? `full` : accounts.length === 2 ? `1/2` : `1/3`}
                                                    onClick={() => selectAccount(account.index)} />
                                            {/each}
                                        </div>
                                    {/if}
                                </div>
                            {/if}
                            <!-- Action Send / Receive -->
                            <div class="flex flex-row justify-between space-x-4">
                                <Button xl secondary icon="receive" classes="w-1/2" onClick={() => _next(WalletState.Receive)}>
                                    {locale('actions.receive')}
                                </Button>
                                <Button xl secondary icon="transfer" classes="w-1/2" onClick={() => _next(WalletState.Send)}>
                                    {locale('actions.send')}
                                </Button>
                            </div>
                        {:else if state === WalletState.Send}
                            <Send on:next={_next} on:previous={_previous} send={onSend} internalTransfer={onInternalTransfer} {accounts} {locale} {mobile} />
                        {:else if state === WalletState.Receive}
                            <Receive on:next={_next} on:previous={_previous} {accounts} {locale} {mobile} onGenerateAddress={onGenerateAddress} />
                        {/if}
                    </div>
                {/if}
            </div>

            <!-- Portfolio / Token Chart, Latest Transactions, Security -->
            <div class="flex flex-col w-2/3 h-full space-y-4">
                <!-- Portfolio / Token Chart -->
                <div data-label="portfolio-token-chart" class="w-full bg-white rounded-2xl px-10 pt-8 pb-6">
                    <div class="flex justify-between">
                        <div class="flex">
                            {#each Object.values(AvailableCharts) as chart, idx}
                                <span on:click={() => selectedChart.set(chart)}>
                                    <Text type="h4" disabled={chart !== $selectedChart} classes={idx > 0 && 'ml-6'}>{chart}</Text>
                                </span>
                            {/each}
                        </div>
                        <div class="flex">
                            <span>
                                <Dropdown
                                    value={$chartCurrency.toUpperCase()}
                                    items={Object.values(CurrencyTypes).map((currency) => ({
                                        value: currency,
                                        label: currency.toUpperCase(),
                                    }))}
                                    onSelect={(newCurrency) => chartCurrency.set(newCurrency)} />
                            </span>
                            <span class="ml-6">
                                <Dropdown
                                    value={TIMEFRAME_MAP[$chartTimeframe]}
                                    items={Object.keys(TIMEFRAME_MAP).map((value) => ({ label: TIMEFRAME_MAP[value], value }))}
                                    onSelect={(newTimeframe) => chartTimeframe.set(newTimeframe)} />
                            </span>
                        </div>
                    </div>
                    <div class="flex-auto">
                        <Chart type="line" />
                    </div>
                </div>
                <div class="w-full flex flex-row flex-1 space-x-4">
                    <!-- Latest Transactions -->
                    <div
                        data-label="latest-transactions"
                        class="bg-white dark:bg-gray-800 rounded-2xl w-1/2 p-8 flex-grow flex flex-col">
                        <Text type="h4" classes="mb-5">Latest Transactions</Text>
                        <div class="overflow-y-auto flex-auto h-1 space-y-2">
                            {#each transactions as transaction}
                                <ActivityRow
                                    {...transaction}
                                    color={accounts.find((acc) => acc.index === transaction.account)?.color} />
                            {/each}
                        </div>
                    </div>
                    <!-- Security -->
                    <div data-label="security" class="bg-white rounded-2xl w-1/2 p-8 flex-grow flex flex-col">
                        <Text type="h4" classes="mb-5">Security</Text>
                        <div class="overflow-auto space-y-2">
                            <!-- Stronghold -->
                            <div
                                data-label="stronghold"
                                class="flex rounded-2xl items-center p-4 border border-solid border-gray-200">
                                <Icon icon="arrow-down" />
                                <div class="flex flex-col ml-4">
                                    <Text type="p" bold smaller>Stronghold Enabled</Text>
                                    <Text type="p" error smaller>Backup required</Text>
                                </div>
                                <div class="flex-1 items-end flex flex-col ml-4">
                                    <Icon icon="arrow-up" />
                                </div>
                            </div>
                            <!-- Wallet Version -->
                            <div
                                data-label="wallet-version"
                                class="flex rounded-2xl items-center p-4 border border-solid border-gray-200">
                                <Icon icon="arrow-down" />
                                <div class="flex flex-col ml-4">
                                    <Text type="p" bold smaller>Firefly v. 1.32</Text>
                                    <Text type="p" secondary smaller>Up to-date</Text>
                                </div>
                                <div class="flex-1 items-end flex flex-col ml-4">
                                    <Icon icon="arrow-up" />
                                </div>
                            </div>
                            <!-- Hardware Device -->
                            <div
                                data-label="hardware-device"
                                class="flex rounded-2xl items-center p-4 border border-solid border-gray-200">
                                <Icon icon="arrow-down" />
                                <div class="flex flex-col ml-4">
                                    <Text type="p" bold smaller>Hardware Device</Text>
                                    <Text type="p" secondary smaller>None detected</Text>
                                </div>
                                <div class="flex-1 items-end flex flex-col ml-4">
                                    <Icon icon="arrow-up" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
{/if}
