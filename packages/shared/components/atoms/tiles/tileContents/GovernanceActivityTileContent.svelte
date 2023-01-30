<script lang="typescript">
    import { localize } from '@core/i18n'
    import {
        GovernanceActivity,
        getActivityTileTitle,
        getFormattedVotingPowerFromGovernanceActivity,
        GovernanceAction,
    } from '@core/wallet'
    import { ActivityTileContent } from 'shared/components'
    import { Icon } from '@lib/auxiliary/icon'
    import { truncateString } from '@core/utils'

    export let activity: GovernanceActivity

    $: icon =
        activity.governanceAction === GovernanceAction.DecreaseVotingPower ||
        activity.governanceAction === GovernanceAction.IncreaseVotingPower
            ? Icon.Governance
            : Icon.Voted
    $: amount =
        activity.governanceAction === GovernanceAction.DecreaseVotingPower ||
        activity.governanceAction === GovernanceAction.IncreaseVotingPower
            ? getFormattedVotingPowerFromGovernanceActivity(activity)
            : ''
    $: title = localize(getActivityTileTitle(activity))
    $: subtitle = activity.participation
        ? localize('general.forEvent', {
              values: { eventId: truncateString(activity.participation.eventId, 6, 6) },
          })
        : ''
</script>

<ActivityTileContent
    {icon}
    {title}
    {subtitle}
    {amount}
    amountColor={activity.governanceAction === GovernanceAction.DecreaseVotingPower ? '' : 'blue-700'}
/>
