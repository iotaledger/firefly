<script lang="typescript">
    import { KeyValueBox } from 'shared/components'
    import { getFormattedTimeStamp, localize } from '@core/i18n'
    import { getFormattedVotingPowerFromGovernanceActivity, GovernanceActivity } from '@core/wallet'

    export let activity: GovernanceActivity

    $: formattedTransactionTime = getFormattedTimeStamp(activity.time)

    let transactionDetailsList: { [key in string]: { data: string } }
    $: transactionDetailsList = {
        ...(activity.time && {
            transactionTime: { data: formattedTransactionTime },
        }),
        ...(activity.votingPower && {
            votingPower: { data: getFormattedVotingPowerFromGovernanceActivity(activity) },
        }),
    }
</script>

{#each Object.entries(transactionDetailsList) as [key, value]}
    <KeyValueBox keyText={localize(`general.${key}`)} valueText={value.data} />
{/each}
