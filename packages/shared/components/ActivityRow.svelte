<script>
    import { Icon, Text } from '@shared-components'

    export let hash
    export let timestamp
    export let amount
    export let received
</script>

<div data-label="transaction-row" class="flex rounded-2xl items-center mb-6 bg-gray-100 p-4">
    <Icon icon={received ? 'arrow-down' : 'arrow-up'} />
    <div class="flex flex-col ml-4">
        <Text type="p" bold>{hash}</Text>
        <Text type="p" secondary>{timestamp}</Text>
    </div>
    <div class="flex-1 items-end flex flex-col ml-4">
        <Text type="p">{amount}</Text>
    </div>
</div>
