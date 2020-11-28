<script>
    import { Box, Text } from 'shared/components'

    export let balance
    export let transactions
    export let accounts
</script>

<Box classes="flex flex-col h-full">
    <Box classes="flex-grow border-solid border-b border-gray-200">
        <Text type="p" secondary classes="mb-3 uppercase">Balance</Text>
        <Box classes="flex mb-2">
            <Text type="h2" classes="uppercase">{balance.split(' ')[0]}</Text>
            <Text type="p" secondary classes="ml-1">{balance.split(' ')[1]}</Text>
        </Box>
        <Text type="h4" highlighted classes="mb-3 uppercase">45000 USD</Text>
    </Box>

    <Box classes="flex-grow-0 mt-4">
        <Box classes="flex justify-between">
            <Box classes="flex flex-col">
                <Text type="p" secondary classes="uppercase">Transactions</Text>
                <Text type="h4">{transactions}</Text>
            </Box>
            <Box classes="flex flex-col">
                <Text type="p" secondary classes="uppercase">Accounts</Text>
                <Text type="h4">{accounts}</Text>
            </Box>
        </Box>
    </Box>
</Box>
