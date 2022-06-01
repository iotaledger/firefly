<script lang="typescript">
    import { Icon, Text } from 'shared/components'
    import { localize } from '@core/i18n'
    import { FontWeightText } from './Text.svelte'
    import { ActivityAsyncStatus, ActivityDirection, ActivityType, Activity, InclusionState } from '@core/wallet'
    import { truncateString } from '@lib/helpers'
    import Hr from './HR.svelte'
    import ActivityAsyncStatusPill from './atoms/pills/ActivityAsyncStatusPill.svelte'
    import { onMount } from 'svelte'

    export let activity: Activity
    export let onClick: () => void

    let title = ''
    let direction = ''
    let icon = ''
    let iconColor = ''
    let subject = ''
    $: {
        if (activity.type === ActivityType.Transfer) {
            icon = 'transfer'
            iconColor = 'gray-600'
            title = activity.inclusionState === InclusionState.Confirmed ? 'general.transfer' : 'general.transferring'
        } else if (activity.type === ActivityType.Receive) {
            icon = 'chevron-down'
            iconColor = 'blue-700'
            title = activity.inclusionState === InclusionState.Confirmed ? 'general.received' : 'general.receiving'
        } else if (activity.type === ActivityType.Send) {
            icon = 'chevron-up'
            iconColor = 'blue-500'
            title = activity.inclusionState === InclusionState.Confirmed ? 'general.sent' : 'general.sending'
        }
        direction = activity.direction === ActivityDirection.In ? 'general.fromAddress' : 'general.toAddress'
        subject =
            activity.recipient.type === 'account'
                ? truncateString(activity.recipient.account?.name, 13, 0)
                : truncateString(activity.recipient.address, 6, 8)
    }

    let time = new Date()
    onMount(() => {
        if (activity.isAsync && activity.isClaimed) {
            const interval = setInterval(() => {
                time = new Date()
            }, 1000)

            return () => {
                clearInterval(interval)
            }
        }
    })

    $: asyncStatus = activity.getAsyncStatus(time)
    $: isIncomingActivityUnclaimed =
        activity.direction === ActivityDirection.In && asyncStatus === ActivityAsyncStatus.Unclaimed

    let timeDiff: string
    $: {
        if (activity.isAsync && !activity.isClaimed && activity?.expireDate) {
            const elapsedTime = activity.expireDate.getTime() - time.getTime()
            const days = Math.floor(elapsedTime / (1000 * 60 * 60 * 24))
            const hours = Math.floor((elapsedTime / (1000 * 60 * 60)) % 24)
            const minutes = Math.floor((elapsedTime / (1000 * 60)) % 60)

            if (days > 0 || hours > 0) {
                timeDiff = `${days}d ${hours}h`
            } else if (minutes > 0) {
                timeDiff = `${minutes}min`
            } else {
                timeDiff = '-'
            }
        }
    }

    // TODO
    function handleReject(): void {}

    // TODO
    function handleClaim(): void {}
</script>

<div
    class="w-full text-left flex flex-col rounded-2xl bg-gray-50 dark:bg-gray-900 dark:bg-opacity-50"
    class:opacity-50={activity.inclusionState !== InclusionState.Confirmed}
>
    <button
        on:click={onClick}
        data-label="transaction-row"
        class="w-full text-left flex flex-col rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-700 dark:bg-opacity-50 p-4"
        class:opacity-50={activity.inclusionState !== InclusionState.Confirmed}
    >
        <div class="flex items-center w-full">
            <div class="w-8 flex flex-row justify-center items-center">
                <Icon width="22" height="22" boxed classes="text-white" boxClasses="bg-{iconColor}" {icon} />
            </div>
            <div class="flex flex-col ml-3.5">
                <Text
                    fontWeight={FontWeightText.semibold}
                    lineHeight="140"
                    classes="overflow-hidden overflow-ellipsis multiwrap-line2"
                >
                    {localize(title)}
                </Text>
                <Text fontWeight={FontWeightText.medium} lineHeight="140" color="gray-500">
                    {localize(direction, { values: { account: subject } })}
                </Text>
            </div>
            <div class="flex-1 items-end flex flex-col ml-4">
                <Text
                    fontWeight={FontWeightText.semibold}
                    lineHeight="140"
                    color={activity.direction === ActivityDirection.In ? 'blue-700' : ''}
                    classes="whitespace-nowrap"
                >
                    {activity.getFormattedAmount(true)}
                </Text>
                <Text fontWeight={FontWeightText.medium} lineHeight="140" color="gray-500" classes="whitespace-nowrap">
                    {activity.getFiatAmount()}
                </Text>
            </div>
        </div>
    </button>
    {#if activity.isAsync && !activity.isClaimed}
        <div class="px-4">
            <Hr />
        </div>
        <div class="flex w-full justify-between p-4">
            <div class="flex flex-row justify-center items-center">
                {#if !activity.isClaimed}
                    <Icon width="16" height="16" icon="timer" classes="mr-1 text-gray-600" />
                    <Text secundary fontSize="13" color="gray-600" fontWeight={FontWeightText.semibold}>{timeDiff}</Text
                    >
                {/if}
            </div>
            <div class="flex justify-end flex-row w-2/4 ml-4">
                {#if isIncomingActivityUnclaimed}
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
                    <ActivityAsyncStatusPill {asyncStatus} />
                {/if}
            </div>
        </div>
    {/if}
</div>
