<script lang="typescript">
    import { time } from '@core/app'
    import { localize } from '@core/i18n'
    import {
        Activity,
        ActivityAsyncStatus,
        ActivityDirection,
        claimActivity,
        hideActivity,
        InclusionState,
    } from '@core/wallet'
    import { ActivityAsyncStatusPill, ClickableTile, HR, Icon, Text, Spinner } from 'shared/components'
    import { FontWeightText } from 'shared/components/Text.svelte'

    export let activity: Activity
    export let onClick: () => void

    $: title = activity?.getTitle()
    $: ({ icon, iconColor } = activity?.getIcon())
    $: subject = activity?.getFormattedSubject()
    $: asyncStatus = activity?.getAsyncStatus($time)
    $: isIncomingActivityUnclaimed =
        activity?.direction === ActivityDirection.In && asyncStatus === ActivityAsyncStatus.Unclaimed

    $: timeDiff = activity?.getTimeDiffUntilExpirationTime($time)
</script>

<ClickableTile {onClick} classes={activity?.inclusionState !== InclusionState.Confirmed ? 'opacity-50' : ''}>
    <div class="w-full flex flex-col space-y-4">
        <div class="flex flex-row items-center text-left space-x-4">
            <div class="w-8 flex flex-row justify-center items-center">
                <Icon width="22" height="22" boxed classes="text-white" boxClasses="bg-{iconColor}" {icon} />
            </div>
            <div class="flex flex-col w-full space-y-1">
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
                        color={activity?.direction === ActivityDirection.In ? 'blue-700' : ''}
                        classes="whitespace-nowrap"
                    >
                        {activity?.getFormattedAmount(true)}
                    </Text>
                </div>
                <div class="flex flex-row justify-between">
                    <Text fontWeight={FontWeightText.medium} lineHeight="140" color="gray-500">
                        {localize(
                            activity?.direction === ActivityDirection.In ? 'general.fromAddress' : 'general.toAddress',
                            { values: { account: subject } }
                        )}
                    </Text>
                    <Text
                        fontWeight={FontWeightText.medium}
                        lineHeight="140"
                        color="gray-500"
                        classes="whitespace-nowrap"
                    >
                        {activity?.getFiatAmount()}
                    </Text>
                </div>
            </div>
        </div>
        {#if activity?.isAsync}
            <HR />
            <div class="flex w-full justify-between space-x-4">
                <div class="flex flex-row justify-center items-center space-x-2">
                    {#if !activity?.isClaimed}
                        <Icon width="16" height="16" icon="timer" classes="text-gray-600" />
                        <Text secundary fontSize="13" color="gray-600" fontWeight={FontWeightText.semibold}
                            >{timeDiff ?? localize('general.none')}</Text
                        >
                    {/if}
                </div>
                <div class="flex justify-end flex-row w-2/4 space-x-2">
                    {#if isIncomingActivityUnclaimed}
                        {#if !activity.isClaiming}
                            <button
                                class="action p-1 w-full text-center rounded-4 font-medium text-14 text-blue-500 bg-transparent hover:bg-blue-200"
                                on:click|stopPropagation={() => hideActivity(activity?.id)}
                            >
                                {localize('actions.reject')}
                            </button>
                        {/if}
                        <button
                            class="action p-1 w-full text-center rounded-4 font-medium text-14 text-white bg-blue-500 hover:bg-blue-600 dark:hover:bg-blue-400"
                            on:click|stopPropagation={() => claimActivity(activity)}
                        >
                            {#if activity.isClaiming}
                                <Spinner busy={true} message={localize('actions.claiming')} classes="justify-center" />
                            {:else}
                                {localize('actions.claim')}
                            {/if}
                        </button>
                    {:else}
                        <ActivityAsyncStatusPill {asyncStatus} />
                    {/if}
                </div>
            </div>
        {/if}
    </div>
</ClickableTile>
