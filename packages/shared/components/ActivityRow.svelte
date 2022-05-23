<script lang="typescript">
    import { Icon, Text } from 'shared/components'
    import { localize } from '@core/i18n'
    import { FontWeightText } from './Text.svelte'
    import { ActivityDirection } from '@lib/typings/activity'

    export let activity
    export let onClick = (): void => {}

    let title: string
    let direction: string
    let icon: string
    let iconColor: string
    $: {
        if (activity.internal) {
            icon = 'transfer'
            iconColor = 'gray-600'
            title = activity.confirmed ? 'general.transfer' : 'general.transferring'
        } else if (activity.direction === ActivityDirection.In) {
            icon = 'chevron-down'
            iconColor = 'blue-700'
            title = activity.confirmed ? 'general.received' : 'general.receiving'
        } else {
            icon = 'chevron-up'
            iconColor = 'blue-500'
            title = activity.confirmed ? 'general.sent' : 'general.sending'
        }
        direction = activity.direction === ActivityDirection.In ? 'general.fromAddress' : 'general.toAddress'
    }
</script>

<button
    on:click={onClick}
    data-label="transaction-row"
    class="w-full text-left flex rounded-2xl items-center bg-gray-50 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-700 dark:bg-opacity-50 p-4 overflow-hidden"
    class:opacity-50={!activity.confirmed}
>
    <div class="w-8 flex flex-row justify-center items-center">
        <Icon width="22" height="22" boxed classes="text-white" boxClasses="bg-{iconColor}" {icon} />
    </div>
    <div class="flex flex-col ml-3.5 space-y-1.5 overflow-hidden">
        <Text type="p" bold smaller classes="overflow-hidden overflow-ellipsis multiwrap-line2">
            {localize(title)}
        </Text>
        <p class="text-10 leading-120 text-gray-500">
            {localize(direction, { values: { account: activity.subject } })}
        </p>
    </div>
    <div class="flex-1 items-end flex flex-col ml-4">
        <Text
            type="p"
            font-weight={FontWeightText.bold}
            color={activity.direction === ActivityDirection.In ? 'blue-700' : ''}
            smaller
            classes="whitespace-nowrap font-bold">{activity.amount}</Text
        >
        <Text type="p" smaller classes="whitespace-nowrap">{activity.fiatAmount}</Text>
    </div>
</button>
