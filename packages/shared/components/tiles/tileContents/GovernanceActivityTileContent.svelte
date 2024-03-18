<script lang="ts">
    import { localize } from '@core/i18n'
    import {
        ActivityGovernance,
        getFormattedVotingPowerFromGovernanceActivity,
        GovernanceAction,
    } from '@core/wallet'
    import { ActivityTileContent } from '@ui'
    import { Icon } from '@lib/auxiliary/icon'

    export let activity: ActivityGovernance

    $: isVotingPowerActivity =
        activity.governanceAction() === GovernanceAction.DecreaseVotingPower ||
        activity.governanceAction() === GovernanceAction.IncreaseVotingPower
    $: icon = isVotingPowerActivity ? Icon.Governance : Icon.Voted
    $: amount = isVotingPowerActivity ? getFormattedVotingPowerFromGovernanceActivity(activity) : ''
    $: action = localize(activity.tileTitle())

    $: formattedAsset = {
        text: amount,
        color: activity.governanceAction() === GovernanceAction.DecreaseVotingPower ? '' : 'blue-700',
        classes: 'shrink-0',
    }
</script>

<ActivityTileContent {icon} {action} subject={localize('general.internalTransaction')} {formattedAsset} />
