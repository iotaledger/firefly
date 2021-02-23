<script>
    import { Icon, Text } from 'shared/components'
    import { truncateString } from 'shared/lib/helpers'
    export let id
    export let timestamp
    export let value
    export let incoming
    export let internal
    export let color
    export let onClick = () => {}
</script>

<button
    on:click={(id) => onClick(id)}
    data-label="transaction-row"
    class="w-full text-left flex rounded-2xl items-center bg-gray-100 dark:bg-gray-900 dark:bg-opacity-50 p-4">
    <Icon
        boxed
        classes="text-white dark:text-{internal ? 'gray-500' : `${color}-${incoming ? '500' : '600'}`}"
        boxClasses="bg-{internal ? 'gray-500' : `${color}-${incoming ? '500' : '600'}`} dark:bg-gray-900"
        icon={internal ? 'transfer' : incoming ? 'arrow-down' : 'arrow-up'} />
    <div class="flex flex-col ml-4">
        <Text type="p" bold smaller>{truncateString(id)}</Text>
        <Text type="p" secondary smaller>{timestamp}</Text>
    </div>
    <div class="flex-1 items-end flex flex-col ml-4">
        <Text type="p" smaller>{value}</Text>
    </div>
</button>
