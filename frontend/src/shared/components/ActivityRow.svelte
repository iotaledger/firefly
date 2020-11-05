<script>
    import { Logo, Box, Text } from '@shared-components'

    export let hash
    export let timestamp
    export let amount
    export let received
</script>

<style type="text/scss">
    activity-row {
        :global(.highlighted.green) {
            color: #0fc1b7;
        }
    }
</style>

<activity-row class="flex mb-6">
    <Logo width="40px" logo="profile-picture" />
    <Box classes="flex flex-col ml-4">
        <Text type="p">{hash}</Text>
        <Text type="p" secondary>{timestamp}</Text>
    </Box>
    <Box classes="flex-1 items-end flex flex-col ml-4">
        <Text type="p" bold>{amount}</Text>
        <Text type="p" highlighted classes={received ? 'green' : ''}>{received ? 'Received' : 'Sent'}</Text>
    </Box>
</activity-row>
