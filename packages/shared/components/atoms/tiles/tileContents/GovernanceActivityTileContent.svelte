<script lang="ts">
    import { localize } from '@core/i18n'
    import {
        GovernanceActivity,
        getActivityTileTitle,
        getFormattedVotingPowerFromGovernanceActivity,
        GovernanceAction,
    } from '@core/wallet'
    import { Text, Icon, FontWeight } from 'shared/components'
    import { Icon as IconEnum } from '@lib/auxiliary/icon'
    import { truncateString } from '@core/utils'

    export let activity: GovernanceActivity

    $: icon =
        activity.governanceAction === GovernanceAction.DecreaseVotingPower ||
        activity.governanceAction === GovernanceAction.IncreaseVotingPower
            ? IconEnum.Governance
            : IconEnum.Voted
    $: amount = getFormattedVotingPowerFromGovernanceActivity(activity)
    $: title = getActivityTileTitle(activity)
</script>

<div class="relative flex w-8 h-8">
    <div class="rounded-full flex justify-center items-center transition-none p-1 w-8 h-8 bg-gray-500">
        <Icon {icon} width="83.33333%" height="83.33333%" classes="text-white dark:text-gray-800 text-center" />
    </div>
</div>
<div class="flex flex-col w-full space-y-0.5">
    <div class="flex flex-row justify-between">
        <Text
            fontWeight={FontWeight.semibold}
            lineHeight="140"
            classes="overflow-hidden overflow-ellipsis multiwrap-line2"
        >
            {localize(title)}
        </Text>
        {#if activity.governanceAction === GovernanceAction.DecreaseVotingPower || activity.governanceAction === GovernanceAction.IncreaseVotingPower}
            <Text
                fontWeight={FontWeight.semibold}
                lineHeight="140"
                classes="text-right"
                color={activity.governanceAction === GovernanceAction.DecreaseVotingPower ? '' : 'blue-700'}
            >
                {amount}
            </Text>
        {/if}
    </div>
    {#if activity.participation}
        <div class="flex flex-row justify-between">
            <Text fontWeight={FontWeight.medium} lineHeight="140" color="gray-600">
                {localize('general.forEvent', {
                    values: { eventId: truncateString(activity.participation.eventId, 6, 6) },
                })}
            </Text>
        </div>
    {/if}
</div>
