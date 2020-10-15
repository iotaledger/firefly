<script>
    import {Logo, Box, Text} from '@shared-components'

    export let hash
    export let timestamp
    export let amount
    export let received
</script>

<Box classes="flex mb-6">
    <Logo width="40px" logo="profile-picture"/>
    <Box classes="flex flex-col ml-4">
        <Text type="p">{hash}</Text>
        <Text type="p" secondary>{timestamp}</Text>
    </Box>
    <Box classes="flex-1 items-end flex flex-col ml-4">
        <Text type="p">{amount}</Text>
        <Text type="p" highlighted={!received}>{received ? 'Received' : 'Sent'}</Text>
    </Box>
</Box>
