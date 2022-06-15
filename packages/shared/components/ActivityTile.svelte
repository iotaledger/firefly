<script lang="typescript">
    import { Icon, Text } from 'shared/components'
    import { localize } from '@core/i18n'
    import { FontWeightText } from './Text.svelte'
    import {
        ActivityAsyncStatus,
        ActivityDirection,
        ActivityType,
        Activity,
        InclusionState,
        hideActivity,
        claimActivity,
    } from '@core/wallet'
    import { truncateString } from '@lib/helpers'
    import Hr from './HR.svelte'
    import ActivityAsyncStatusPill from './atoms/pills/ActivityAsyncStatusPill.svelte'
    import { time } from '@core/app'
    import { activeProfile } from '@core/profile'
    import { NETWORK } from '@core/network'

    export let activity: Activity
    export let onClick: () => void

    let title = ''
    let icon = ''
    let iconColor = ''
    let subject = ''
    $: {
        if (activity.type === ActivityType.InternalTransaction) {
            icon = 'transfer'
            iconColor = 'gray-600'
            title = activity.inclusionState === InclusionState.Confirmed ? 'general.transfer' : 'general.transferring'
        } else if (activity.type === ActivityType.ExternalTransaction) {
            if (activity.direction === ActivityDirection.In) {
                icon = 'chevron-down'
                iconColor = 'blue-700'
                title = activity.inclusionState === InclusionState.Confirmed ? 'general.received' : 'general.receiving'
            } else if (activity.direction === ActivityDirection.Out) {
                icon = 'chevron-up'
                iconColor = 'blue-500'
                title = activity.inclusionState === InclusionState.Confirmed ? 'general.sent' : 'general.sending'
            }
        }

        if (activity?.subject?.type === 'account') {
            subject = truncateString(activity?.subject?.account?.name, 13, 0)
        } else if (activity?.subject?.type === 'address') {
            subject = truncateString(
                activity?.subject?.address,
                NETWORK?.[$activeProfile.networkProtocol]?.[$activeProfile.networkType]?.bech32Hrp.length,
                6
            )
        } else {
            subject = localize('general.unknownAddress')
        }
    }

    $: asyncStatus = activity.getAsyncStatus($time)
    $: isIncomingActivityUnclaimed =
        activity.direction === ActivityDirection.In && asyncStatus === ActivityAsyncStatus.Unclaimed

    $: timeDiff = activity.getTimeDiffUntilExpirationTime($time)
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
            <div class="flex flex-col w-full ml-3.5">
                <div class="flex flex-row justify-between space-x-1">
                    <Text
                        fontWeight={FontWeightText.semibold}
                        lineHeight="140"
                        classes="overflow-hidden overflow-ellipsis multiwrap-line2"
                    >
                        {localize(title)}
                    </Text>
                    <Text
                        fontWeight={FontWeightText.semibold}
                        lineHeight="140"
                        color={activity.direction === ActivityDirection.In ? 'blue-700' : ''}
                        classes="whitespace-nowrap"
                    >
                        {activity.getFormattedAmount(true)}
                    </Text>
                </div>
                <div class="flex flex-row justify-between">
                    <Text fontWeight={FontWeightText.medium} lineHeight="140" color="gray-500">
                        {localize(
                            activity.direction === ActivityDirection.In ? 'general.fromAddress' : 'general.toAddress',
                            { values: { account: subject } }
                        )}
                    </Text>
                    <Text
                        fontWeight={FontWeightText.medium}
                        lineHeight="140"
                        color="gray-500"
                        classes="whitespace-nowrap"
                    >
                        {activity.getFiatAmount()}
                    </Text>
                </div>
            </div>
        </div>
    </button>
    {#if activity.isAsync && !activity.isClaimed}
        <div class="px-4">
            <Hr />
        </div>
        <div class="flex w-full justify-between p-4">
            <div class="flex flex-row justify-center items-center space-x-2">
                {#if !activity.isClaimed}
                    <Icon width="16" height="16" icon="timer" classes="text-gray-600" />
                    <Text secundary fontSize="13" color="gray-600" fontWeight={FontWeightText.semibold}
                        >{timeDiff ?? localize('general.none')}</Text
                    >
                {/if}
            </div>
            <div class="flex justify-end flex-row w-2/4 ml-4">
                {#if isIncomingActivityUnclaimed}
                    <button
                        class="action p-1 mr-1 w-full text-center font-medium text-14 text-blue-500"
                        on:click={() => hideActivity(activity.id)}
                    >
                        {localize('actions.reject')}
                    </button>
                    <button
                        class="action p-1 w-full text-center rounded-lg font-medium text-14 bg-blue-500 text-white"
                        on:click={() => claimActivity(activity.id)}
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
