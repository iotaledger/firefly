<script lang="typescript">
    import { Dropdown, Icon, ActivityRow, Chart, Text, Button } from 'shared/components'
    import {
        selectedChart,
        CurrencyTypes,
        chartCurrency,
        chartTimeframe,
        TIMEFRAME_MAP,
        AvailableCharts,
    } from 'shared/lib/marketData'
    import { Send, Receive } from './views/'
    export let locale
    export let mobile
    const AccountColors = ['turquoise', 'green', 'orange', 'yellow', 'purple', 'pink']
    enum WalletState {
        Init = 'init',
        Send = 'send',
        Receive = 'receive',
    }
    let state: WalletState = WalletState.Init
    let stateHistory = []
    const _next = (request) => {
        let nextState
        switch (state) {
            case WalletState.Init:
                if (request === 'send') {
                    nextState = WalletState.Send
                } else if (request === 'receive') {
                    nextState = WalletState.Receive
                }
                break
            case WalletState.Send:
                // do logic here
                nextState = WalletState.Init
                break
            case WalletState.Receive:
                // do logic here
                nextState = WalletState.Init
                break
        }
        if (nextState) {
            stateHistory.push(state)
            stateHistory = stateHistory
            state = nextState
        }
    }
    const _prev = (event) => {
        const _previous = () => {
            let prevState = stateHistory.pop()
            if (prevState) {
                state = prevState
            }
        }
    }
    const transactions = [
        {
            hash: 'JWL9...KFL9M',
            timestamp: '20 June, 2020, 14:03',
            amount: '251 Gi',
            received: true,
        },
        {
            hash: 'JWL9...KFL9M',
            timestamp: '20 June, 2020, 14:03',
            amount: '151 Gi',
            received: false,
        },
        {
            hash: 'JWL9...KFL9M',
            timestamp: '20 June, 2020, 14:03',
            amount: '50 Gi',
            received: true,
        },
    ]
    const totalIncoming = {
        amount: 32,
        unit: 'Gi',
    }
    const totalOutgoing = {
        amount: 16,
        unit: 'Gi',
    }
    const accounts = [
        {
            index: 0,
            name: 'Fun Wallet',
            balance: '23.322 Gi',
            balanceEquiv: '45500 USD',
        },
        {
            index: 1,
            name: 'Billy Bills',
            balance: '23.322 Gi',
            balanceEquiv: '45500 USD',
        },
        {
            index: 2,
            name: 'Pizza Fund',
            balance: '23.322 Gi',
            balanceEquiv: '45500 USD',
        },
        {
            index: 3,
            name: 'Wonder Alice',
            balance: '23.322 Gi',
            balanceEquiv: '45500 USD',
        },
        {
            index: 4,
            name: 'Tropical Palm',
            balance: '23.322 Gi',
            balanceEquiv: '45500 USD',
        },
        {
            index: 5,
            name: 'Johnny Bravo',
            balance: '23.322 Gi',
            balanceEquiv: '45500 USD',
        },
    ]
</script>

<div class="w-full h-full p-10 flex flex-row gap-4">
    <!-- Total Balance, Accounts list & Send/Receive -->
    <div class="flex flex-auto flex-col w-1/3 h-full flex-shrink-0">
        <div class="bg-gradient-to-b from-blue-500 to-blue-600 rounded-t-2xl pt-10 pb-16 px-8">
            <!-- Balance -->
            <div data-label="total-balance">
                <Text type="p" overrideColor smaller classes="text-white mb-2">{locale('general.total_balance')}</Text>
                <Text type="h1" overrideColor classes="text-white mb-2">23.322,32 Mi</Text>
                <Text type="p" overrideColor smaller classes="text-blue-300">45500 USD</Text>
            </div>
            {#if state === WalletState.Init}
                <!-- Incoming/Outgoing -->
                <div data-label="total-movements" class="flex flex-row justify-between mt-10">
                    {#if totalIncoming.amount > 0}
                        <div class="flex items-center">
                            <Icon boxed icon="arrow-down" classes="text-green-500" boxClasses="bg-white mr-4" />
                            <div>
                                <Text type="p" classes="text-white mb-0.5">
                                    {`${totalIncoming.amount} ${totalIncoming.unit}`}
                                </Text>
                                <Text type="p" overrideColor smaller classes="text-blue-300">{locale('general.incoming')}</Text>
                            </div>
                        </div>
                    {/if}
                    {#if totalOutgoing.amount > 0}
                        <div class="flex items-center">
                            <Icon boxed icon="arrow-up" classes="text-blue-500" boxClasses="bg-white mr-4" />
                            <div>
                                <Text type="p" classes="text-white mb-0.5">
                                    {`${totalOutgoing.amount} ${totalOutgoing.unit}`}
                                </Text>
                                <Text type="p" overrideColor smaller classes="text-blue-300">{locale('general.outgoing')}</Text>
                            </div>
                        </div>
                    {/if}
                </div>
            {/if}
        </div>
        <div class="bg-white rounded-2xl p-8 -mt-5 flex flex-col h-full justify-between">
            <!-- Accounts -->
            {#if state === WalletState.Init}
                <div data-label="accounts">
                    <div class="flex flex-row mb-6">
                        <Text type="h5">{locale('general.accounts')}</Text>
                    </div>
                    {#if accounts.length > 0}
                        <div class="flex flex-row justify-between flex-wrap w-full px-2 ">
                            {#each accounts as account, index}
                                <div
                                    class={`group rounded-2xl bg-gray-200 hover:bg-${AccountColors[index]}-500 flex-col justify-between -mx-2 mb-2 p-5 w-${accounts.length === 1 ? `full` : accounts.length === 2 ? `1/2` : `1/3`}`}>
                                    <Text type="p" smaller overrideColor classes="mb-10 text-gray-800 group-hover:text-white">
                                        {account.name}
                                    </Text>
                                    <div class="flex flex-wrap justify-between -mx-4">
                                        <Text
                                            type="p"
                                            smaller
                                            overrideColor
                                            classes="text-gray-800 group-hover:text-white group-hover:font-700 px-4">
                                            {account.balance}
                                        </Text>
                                        <Text type="p" smaller overrideColor classes="text-blue-500 group-hover:text-white px-4">
                                            {account.balanceEquiv}
                                        </Text>
                                    </div>
                                </div>
                            {/each}
                        </div>
                    {/if}
                </div>
                <!-- Action Send / Receive -->
                <div class="flex flex-row justify-between px-2 ">
                    <Button xl secondary icon="receive" classes="-mx-2 w-1/2" onClick={() => _next(WalletState.Receive)}>
                        {locale('actions.receive')}
                    </Button>
                    <Button xl secondary icon="transfer" classes="-mx-2 w-1/2" onClick={() => _next(WalletState.Send)}>
                        {locale('actions.send')}
                    </Button>
                </div>
            {:else if state === WalletState.Send}
                <Send on:next={_next} {accounts} {locale} {mobile} />
            {/if}
        </div>
    </div>

    <!-- Portfolio / Token Chart, Latest Transactions, Security -->
    <div class="flex flex-col flex-wrap w-2/3 h-full">
        <!-- Portfolio / Token Chart -->
        <div data-label="portfolio-token-chart" class="w-full bg-white rounded-2xl px-10 pt-8 pb-6 mb-4">
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
        <div class="w-full flex flex-row flex-1 gap-4">
            <!-- Latest Transactions -->
            <div data-label="latest-transactions" class="bg-white rounded-2xl w-1/2 p-8 flex-grow flex flex-col">
                <Text type="h4" classes="mb-5">Latest Transactions</Text>
                <div class="overflow-auto">
                    {#each transactions as transaction}
                        <ActivityRow {...transaction} />
                    {/each}
                </div>
            </div>
            <!-- Security -->
            <div data-label="security" class="bg-white rounded-2xl w-1/2 p-8 flex-grow flex flex-col">
                <Text type="h4" classes="mb-5">Security</Text>
                <div class="overflow-auto">
                    <!-- Stronghold -->
                    <div
                        data-label="stronghold"
                        class="flex rounded-2xl items-center mb-6 p-4 border border-solid border-gray-200">
                        <Icon icon="arrow-down" />
                        <div class="flex flex-col ml-4">
                            <Text type="p" bold>Stronghold Enabled</Text>
                            <Text type="p" error>Backup required</Text>
                        </div>
                        <div class="flex-1 items-end flex flex-col ml-4">
                            <Icon icon="arrow-up" />
                        </div>
                    </div>
                    <!-- Wallet Version -->
                    <div
                        data-label="wallet-version"
                        class="flex rounded-2xl items-center mb-6 p-4 border border-solid border-gray-200">
                        <Icon icon="arrow-down" />
                        <div class="flex flex-col ml-4">
                            <Text type="p" bold>Firefly v. 1.32</Text>
                            <Text type="p" secondary>Up to-date</Text>
                        </div>
                        <div class="flex-1 items-end flex flex-col ml-4">
                            <Icon icon="arrow-up" />
                        </div>
                    </div>
                    <!-- Hardware Device -->
                    <div
                        data-label="hardware-device"
                        class="flex rounded-2xl items-center mb-6 p-4 border border-solid border-gray-200">
                        <Icon icon="arrow-down" />
                        <div class="flex flex-col ml-4">
                            <Text type="p" bold>Hardware Device</Text>
                            <Text type="p" secondary>None detected</Text>
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
