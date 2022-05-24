<script lang="typescript">
    import { Icon, Text } from 'shared/components'
    import { localize } from '@core/i18n'
    import { FontWeightText } from './Text.svelte'
    import { ActivityAsyncStatus, ActivityDirection, ActivityType, IActivity } from '@lib/typings/activity'
    import { truncateString } from '@lib/helpers'
    import Hr from './HR.svelte'
    import ActivityAsyncStatusPill from './atoms/pills/ActivityAsyncStatusPill.svelte'
    import { onMount } from 'svelte'

    export let activity: IActivity
    export let onClick = (): void => {}

    let title = ''
    let direction = ''
    let icon = ''
    let iconColor = ''
    let subject = ''
    $: {
        if (activity.activityType === ActivityType.Transfer) {
            icon = 'transfer'
            iconColor = 'gray-600'
            title = activity.confirmed ? 'general.transfer' : 'general.transferring'
        } else if (activity.activityType === ActivityType.Receive) {
            icon = 'chevron-down'
            iconColor = 'blue-700'
            title = activity.confirmed ? 'general.received' : 'general.receiving'
        } else if (activity.activityType === ActivityType.Send) {
            icon = 'chevron-up'
            iconColor = 'blue-500'
            title = activity.confirmed ? 'general.sent' : 'general.sending'
        }
        direction = activity.direction === ActivityDirection.In ? 'general.fromAddress' : 'general.toAddress'
        subject = activity.subjectAccountName
            ? truncateString(activity.subjectAccountName, 13, 0)
            : truncateString(activity.subjectAddress, 6, 8)
    }

    let time = new Date()
    onMount(() => {
        if (activity.isAsync && activity.asyncStatus !== ActivityAsyncStatus.Claimed) {
            const interval = setInterval(() => {
                time = new Date()
            }, 1000)

            return () => {
                clearInterval(interval)
            }
        }
    })

    const timeDiff = ''

    // these automatically update when `time`
    // changes, because of the `$:` prefix
    $: hours = time.getHours()
    $: minutes = time.getMinutes()
    $: seconds = time.getSeconds()

    // TODO
    function handleReject() {}

    // TODO
    function handleClaim() {}
</script>

<div
    class="w-full text-left flex flex-col rounded-2xl bg-gray-50 dark:bg-gray-900 dark:bg-opacity-50"
    class:opacity-50={!activity.confirmed}
>
    <button
        on:click={onClick}
        data-label="transaction-row"
        class="w-full text-left flex flex-col rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-700 dark:bg-opacity-50 p-4"
        class:opacity-50={!activity.confirmed}
    >
        <div class="flex items-center w-full">
            <div class="w-8 flex flex-row justify-center items-center">
                <Icon width="22" height="22" boxed classes="text-white" boxClasses="bg-{iconColor}" {icon} />
            </div>
            <div class="flex flex-col ml-3.5">
                <Text bold fontSize="13" classes="overflow-hidden overflow-ellipsis multiwrap-line2">
                    {localize(title)}
                </Text>
                <Text
                    secondary
                    fontSize="13"
                    fontWeight={FontWeightText.medium}
                    class="text-10 leading-120 text-gray-500"
                >
                    {localize(direction, { values: { account: subject } })}
                </Text>
            </div>
            <div class="flex-1 items-end flex flex-col ml-4">
                <Text
                    fontWeight={FontWeightText.bold}
                    color={activity.direction === ActivityDirection.In ? 'blue-700' : ''}
                    fontSize="13"
                    classes="whitespace-nowrap"
                >
                    {activity.amount}
                </Text>
                <Text fontSize="13" color="gray-600" fontWeight={FontWeightText.medium} classes="whitespace-nowrap"
                    >{activity.fiatAmount}</Text
                >
            </div>
        </div>
    </button>
    {#if activity.isAsync && activity.asyncStatus !== ActivityAsyncStatus.Claimed}
        <Hr classes="w-full px-4" />
        <div class="flex w-full justify-between p-4">
            <div class="flex flex-row justify-center items-center">
                {#if activity.asyncStatus === ActivityAsyncStatus.Unclaimed}
                    <Icon width="16" height="16" icon="timer" classes="mr-1 text-gray-600" />
                    <Text secundary fontSize="13" color="gray-600" fontWeight={FontWeightText.semibold}>1d 2h</Text>
                {/if}
            </div>
            <div class="flex justify-end flex-row w-2/4 ml-4">
                {#if activity.direction === ActivityDirection.In}
                    {#if activity.asyncStatus === ActivityAsyncStatus.Unclaimed}
                        <button
                            class="action p-1 mr-1 w-full text-center font-medium text-14 text-blue-500"
                            on:click={handleReject}
                        >
                            {localize('actions.reject')}
                        </button>
                        <button
                            class="action p-1 w-full text-center rounded-lg font-medium text-14 bg-blue-500 text-white"
                            on:click={handleClaim}
                        >
                            {localize('actions.claim')}
                        </button>
                    {:else}
                        <ActivityAsyncStatusPill asyncStatus={activity.asyncStatus} />
                    {/if}
                {:else}
                    <ActivityAsyncStatusPill asyncStatus={activity.asyncStatus} />
                {/if}
            </div>
        </div>
    {/if}
</div>
