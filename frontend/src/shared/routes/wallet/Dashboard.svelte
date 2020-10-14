<script>
    import {
        ActivityRow,
        BalanceSummary,
        Sidebar,
        BarChart,
        LineChart,
        Logo,
        Box,
        Text,
        Button,
        Scroller
    } from '@shared-components'

    export let locale
    export let mobile
    export let goto

    let scrollerIndex = 0
    let scrollerProgress = 0
    let read = false
    $: if (scrollerProgress === 100) {
        read = true
    }

    const transactions = [{
        hash: 'JWL9...KFL9M',
        timestamp: '20 June, 2020, 14:03',
        amount: '251 Gi',
        received: true
    }, {
        hash: 'JWL9...KFL9M',
        timestamp: '20 June, 2020, 14:03',
        amount: '151 Gi',
        received: false
    }, {
        hash: 'JWL9...KFL9M',
        timestamp: '20 June, 2020, 14:03',
        amount: '50 Gi',
        received: true
    }, {
        hash: 'JWL9...KFL9M',
        timestamp: '20 June, 2020, 14:03',
        amount: '50 Gi',
        received: false
    }]

</script>

{#if mobile}
    <div>foo</div>
{:else}
    <Box classes="w-full h-full flex flex-row">
        <Sidebar />

        <Box classes="flex-auto w-1/2 px-12 py-8">
            <Text type="h2" classes="mb-5">Wallet</Text>
            <Box classes="flex flex-col h-full pb-16">
                <Box classes="flex-1 flex mb-4 gap-2">
                    <Box classes="w-1/2 bg-white rounded-lg px-10 pt-24 pb-10">
                        <BalanceSummary balance="239 Gi" transactions="2200" accounts="6"  />
                    </Box>

                    <Box classes="items-stretch h-auto w-1/2 bg-white rounded-lg p-10">
                        <Text type="h4" classes="mb-5">Transactions</Text>
                        <Box classes="h-full">
                            <BarChart />
                        </Box>
                    </Box>
                </Box>
                <Box classes="flex-1 flex">
                    <Box classes="w-full bg-white rounded-lg p-10">
                        <Box classes="flex justify-start">
                            <Text type="h4" classes="mb-1">Portfolio</Text>
                            <Text type="h4" disabled classes="mb-1 ml-6">Token</Text>
                        </Box>
                        <Box classes=" flex-1 flex flex-row-reverse">
                            <Text type="p" disabled classes="px-4 py-2">ALL</Text>
                            <Text type="p" disabled classes="px-4 py-2">1Y</Text>
                            <Text type="p" disabled classes="px-4 py-2">1M</Text>
                            <Text type="p" classes="px-4 flex items-center justify-center rounded-full h-8 w-8 bg-blue-500 text-white">1W</Text>
                            <Text type="p" disabled classes="px-4 py-2">1D</Text>
                            <Text type="p" disabled classes="px-4 py-2">1H</Text>
                        </Box>
                        <Box>
                            <LineChart />
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>

        <Box classes="flex-auto bg-white h-screen px-12 py-8 flex flex-col">
            <Text type="h3" classes="mb-5">Accounts</Text>
            <Box classes="h-full">
                <Text type="h3" classes="mb-5">Recent Activity</Text>
                <Box>
                    {#each transactions as transaction}
                        <ActivityRow {...transaction}  />
                    {/each}
                </Box>
            </Box>
            <Box>
                <Button onClick={() => console.info('goto: send')}>Send</Button>
                <Button ghost onClick={() => console.info('goto: receive')}>Receive</Button>
            </Box>
        </Box>
    </Box>
{/if}
