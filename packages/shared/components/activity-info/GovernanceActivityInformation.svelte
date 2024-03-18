<script lang="ts">
    import { KeyValueBox } from '@ui'
    import { getFormattedTimeStamp, localize } from '@core/i18n'
    import { formatTokenAmountBestMatch, GovernanceAction, ActivityGovernance } from '@core/wallet'
    import { getBaseToken } from '@core/profile'
    import { IKeyValueBoxList } from '@core/utils'

    export let activity: ActivityGovernance

    $: formattedTransactionTime = getFormattedTimeStamp(activity.time())

    let transactionDetailsList: IKeyValueBoxList
    $: transactionDetailsList = {
        ...(activity.time() && {
            transactionTime: { data: formattedTransactionTime },
        }),
        ...(activity.votingPower !== undefined && {
            votingPower: {
                data: formatTokenAmountBestMatch(activity.votingPower(), getBaseToken()),
                alternateKey:
                    activity.governanceAction() === GovernanceAction.DecreaseVotingPower ||
                    activity.governanceAction() === GovernanceAction.IncreaseVotingPower
                        ? 'newVotingPower'
                        : 'votingPower',
            },
        }),
    }
</script>

{#each Object.entries(transactionDetailsList) as [key, value]}
    <KeyValueBox keyText={localize(`general.${value.alternateKey ?? key}`)} valueText={value.data} />
{/each}
