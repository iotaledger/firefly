<script lang="typescript">
    import { Icon, ActivityRow, ChartOption, Sidebar, LineChart, Text, Button } from '@shared-components'

    export let locale
    export let mobile

    enum DashboardState {
        Init = 'init',
        Send = 'send',
        Receive = 'receive',
    }

    let state: DashboardState = DashboardState.Init
    let stateHistory = []

    const _next = (event) => {
        let nextState
        let params = event.detail || {}
        switch (state) {
            case DashboardState.Init:
                const { request } = params
                if (request === 'send') {
                    nextState = DashboardState.Send
                } else if (request === 'receive') {
                    nextState = DashboardState.Receive
                }
                break
            case DashboardState.Send:
                // do logic here
                nextState = DashboardState.Init
                break
            case DashboardState.Receive:
                // do logic here
                nextState = DashboardState.Init
                break
        }
        if (nextState) {
            stateHistory.push(nextState)
            stateHistory = stateHistory
            state = nextState
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
            name: 'Fun Wallet',
            balance: '23.322 Gi',
            balanceEquiv: '45500 USD',
        },
        {
            name: 'Billy Bills',
            balance: '23.322 Gi',
            balanceEquiv: '45500 USD',
        },
        {
            name: 'Pizza Fund',
            balance: '23.322 Gi',
            balanceEquiv: '45500 USD',
        },
        {
            name: 'Wonder Alice',
            balance: '23.322 Gi',
            balanceEquiv: '45500 USD',
        },
        {
            name: 'Tropical Palm',
            balance: '23.322 Gi',
            balanceEquiv: '45500 USD',
        },
        {
            name: 'Johnny Bravo',
            balance: '23.322 Gi',
            balanceEquiv: '45500 USD',
        },
    ]
</script>

<style type="text/scss">
    // ISSUE: https://github.com/tailwindlabs/tailwindcss/discussions/1446
    :global(.text-white) {
        @apply text-white;
    }
    :global(.p-smaller) {
        @apply text-12;
        @apply leading-140;
    }
    :global(.text-opacity-75) {
        --text-opacity: 0.75;
    }
    :global(.text-opacity-50) {
        --text-opacity: 0.5;
    }
</style>

{#if mobile}
    <div>foo</div>
{:else}
    <div class="w-full h-full flex flex-row">
        <Sidebar />
        <!-- Dashboard Pane -->
        <div class="w-full h-full p-10 flex flex-row gap-4">
            <!-- Total Balance, Accounts list & Send/Receive -->
            <div class="flex flex-auto flex-col w-1/3 h-full flex-shrink-0">
                <!-- Balance -->
                <div data-label="total-balance" class="bg-blue-700 rounded-t-2xl pt-10 pb-16 px-8">
                    <Text type="p" classes="p-smaller text-white mb-2">Total Balance</Text>
                    <Text type="h1" classes="text-white mb-2">23.322,32 Mi</Text>
                    <Text type="p" classes="p-smaller text-opacity-75 text-white">Total Balance</Text>
                </div>
                <!-- Incoming/Outgoing -->
                <div data-label="total-movements" class="bg-blue-600 rounded-t-2xl p-8 pb-12 -mt-5 flex flex-row justify-between">
                    {#if totalIncoming.amount > 0}
                        <div class="flex items-center">
                            <Icon icon="arrow-down" classes="mr-2" />
                            <div>
                                <Text type="p" classes="text-white mb-1">{`${totalIncoming.amount} ${totalIncoming.unit}`}</Text>
                                <Text type="p" classes="p-smaller text-opacity-50 text-white">Incoming</Text>
                            </div>
                        </div>
                    {/if}
                    {#if totalOutgoing.amount > 0}
                        <div class="flex items-center">
                            <Icon icon="arrow-down" classes="mr-2" />
                            <div>
                                <Text type="p" classes="text-white mb-1">{`${totalOutgoing.amount} ${totalOutgoing.unit}`}</Text>
                                <Text type="p" classes="p-smaller text-opacity-50 text-white">Outgoing</Text>
                            </div>
                        </div>
                    {/if}
                </div>
                <!-- Accounts -->
                <div data-label="accounts" class="bg-white rounded-2xl p-8 -mt-5 flex flex-col h-full justify-between">
                    <div>
                        <div class="flex flex-row mb-6">
                            <Text type="h5">Accounts</Text>
                        </div>
                        <div class="flex flex-row justify-between flex-wrap w-full px-2 ">
                            {#each accounts as account}
                                <div
                                    class={`rounded-2xl bg-gray-200 flex flex-col justify-between -mx-2 mb-2 p-5 w-${accounts.length === 1 ? `full` : accounts.length === 2 ? `1/2` : `1/3`}`}>
                                    <Text type="p" classes="p-smaller mb-10">{account.name}</Text>
                                    <div class="flex">
                                        <Text type="p" classes="p-smaller">{account.balance}</Text>
                                    </div>
                                </div>
                            {/each}
                        </div>
                    </div>
                    <div class="flex flex-row justify-between px-2 ">
                        <Button xl icon="arrow-up" classes="-mx-2 w-1/2" onClick={() => _next('send')}>Send</Button>
                        <Button xl icon="arrow-down" classes="-mx-2 w-1/2" onClick={() => _next('receive')}>Receive</Button>
                    </div>
                </div>
            </div>

            <!-- Portfolio / Token Chart, Latest Transactions, Security -->
            <div class="flex flex-col flex-wrap w-2/3 h-full">
                <!-- Portfolio / Token Chart -->
                <div data-label="portfolio-token-chart" class="w-full bg-white rounded-2xl px-10 pt-8 pb-6 mb-4">
                    <div class="flex justify-start">
                        <Text type="h4">Portfolio</Text>
                        <Text type="h4" disabled classes="ml-6">Token</Text>
                    </div>
                    <div class="flex-1 flex flex-row-reverse">
                        <ChartOption option="ALL" />
                        <ChartOption option="1Y" />
                        <ChartOption option="1M" />
                        <ChartOption selected option="1W" />
                        <ChartOption option="1D" />
                        <ChartOption option="1H" />
                    </div>
                    <div class="flex-auto">
                        <LineChart />
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
    </div>
{/if}
