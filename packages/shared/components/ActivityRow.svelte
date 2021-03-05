<script lang="typescript">
    import { Icon, Text } from 'shared/components'
    import { truncateString } from 'shared/lib/helpers'
    import { formatUnit } from 'shared/lib/units'
    import { date } from 'svelte-i18n'

    export let id
    export let timestamp
    export let value
    export let incoming
    export let internal
    export let confirmed
    export let color
    export let onClick = () => {}
</script>

<button
    on:click={onClick}
    data-label="transaction-row"
    class="w-full text-left flex rounded-2xl items-center bg-gray-100 dark:bg-gray-900 dark:bg-opacity-50 p-4 {!confirmed ? 'opacity-50' : ''}">
    <Icon
        boxed
        classes="text-white dark:text-{internal ? 'gray-500' : `${color}-${incoming ? '500' : '600'}`}"
        boxClasses="bg-{internal ? 'gray-500' : `${color}-${incoming ? '500' : '600'}`} dark:bg-gray-900"
        icon={internal ? 'transfer' : incoming ? 'chevron-down' : 'chevron-up'} />
    <div class="flex flex-col ml-4">
        <Text type="p" bold smaller>{truncateString(id)}</Text>
        <Text type="p" secondary smaller>
            {$date(new Date(timestamp), {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hour12: false,
            })}
        </Text>
    </div>
    <div class="flex-1 items-end flex flex-col ml-4">
        <Text type="p" smaller>{`${!incoming ? '-' : ''}${formatUnit(value)}`}</Text>
    </div>
</button>
