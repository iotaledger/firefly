<script lang="typescript">
    import { ActivityRow, BalanceSummary, ChartOption, Sidebar, BarChart, LineChart, Box, Text, Button } from '@shared-components'
    import { Send, Receive } from '@shared-routes'

    export let locale
    export let mobile

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
        {
            hash: 'JWL9...KFL9M',
            timestamp: '20 June, 2020, 14:03',
            amount: '50 Gi',
            received: false,
        },
    ]
    // TODO IMPROVE ALL THIS
    enum REQUEST_TYPES {
        SEND,
        RECEIVE,
    }
    let ongoingRequestType: REQUEST_TYPES = null
    const handleSendClick = () => {
        ongoingRequestType = REQUEST_TYPES.SEND
    }
    const handleReceiveClick = () => {
        ongoingRequestType = REQUEST_TYPES.RECEIVE
    }
    const sendTransaction = () => {
        ongoingRequestType = null
    }
</script>

<style type="text/scss">
    action-pane {
        background-color: var(--element-bg-color);
        width: 430px;
    }
</style>

{#if mobile}
    <div>foo</div>
{:else}
    <Box classes="w-full h-full flex flex-row">
        <Sidebar />

        <Box classes="flex-auto w-1/2 px-12 py-8">
            <Text type="h2" classes="mb-5">Wallet</Text>
            <Box classes="flex flex-col">
                <!-- Top Boxes (Balance Summary & Transaction Chart) -->
                <Box classes="flex mb-4 gap-2">
                    <Box classes="w-1/2 bg-white rounded-lg px-10 pt-16 pb-6">
                        <BalanceSummary balance="239.321 Gi" transactions="2200" accounts="6" />
                    </Box>
                    <Box classes="items-stretch h-auto w-1/2 bg-white rounded-lg p-10">
                        <Text type="h4" classes="mb-5">Transactions</Text>
                        <Box classes="h-full">
                            <BarChart />
                        </Box>
                    </Box>
                </Box>

                <!-- Portfolio/Token -->
                <Box classes="w-full bg-white rounded-lg px-10 pt-8 pb-6">
                    <Box classes="flex justify-start">
                        <Text type="h4">Portfolio</Text>
                        <Text type="h4" disabled classes="ml-6">Token</Text>
                    </Box>
                    <Box classes="flex-1 flex flex-row-reverse">
                        <ChartOption option="ALL" />
                        <ChartOption option="1Y" />
                        <ChartOption option="1M" />
                        <ChartOption selected option="1W" />
                        <ChartOption option="1D" />
                        <ChartOption option="1H" />
                    </Box>
                    <Box classes="flex-auto">
                        <LineChart />
                    </Box>
                </Box>
            </Box>
        </Box>
        <action-pane class="h-full flex-grow-0 bg-white">
            {#if ongoingRequestType === null}
                <activity class="h-full px-12 py-8 flex flex-col justify-between">
                    <div class="flex-grow flex flex-col min-h-0 mb-5">
                        <Text type="h4" classes="mb-5">{locale('general.recent_activity')}</Text>
                        <div class="overflow-auto">
                            {#each transactions as transaction}
                                <ActivityRow {...transaction} />
                            {/each}
                        </div>
                    </div>
                    <div class="flex justify-between">
                        <Button onClick={() => handleSendClick()}>{locale('actions.send')}</Button>
                        <Button ghost onClick={() => handleReceiveClick()}>{locale('actions.receive')}</Button>
                    </div>
                </activity>
            {:else if ongoingRequestType === REQUEST_TYPES.SEND}
                <Send {locale} {mobile} onSendClick={sendTransaction} />
            {:else if ongoingRequestType === REQUEST_TYPES.RECEIVE}
                <Receive {locale} {mobile} />
            {/if}
        </action-pane>
    </Box>
{/if}
