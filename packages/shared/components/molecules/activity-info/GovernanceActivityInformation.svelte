<script lang="typescript">
    import { KeyValueBox } from 'shared/components'
    import { getFormattedTimeStamp, localize } from '@core/i18n'
    import { formatTokenAmountBestMatch, GovernanceAction, GovernanceActivity } from '@core/wallet'
    import { BASE_TOKEN } from '@core/network'
    import { activeProfile } from '@core/profile'
    import { IKeyValueBoxList } from '@core/utils'

    export let activity: GovernanceActivity

    $: formattedTransactionTime = getFormattedTimeStamp(activity.time)

    let transactionDetailsList: IKeyValueBoxList
    $: transactionDetailsList = {
        ...(activity.time && {
            transactionTime: { data: formattedTransactionTime },
        }),
        ...(activity.votingPower !== undefined && {
            votingPower: {
                data: formatTokenAmountBestMatch(activity.votingPower, BASE_TOKEN[$activeProfile?.networkProtocol], 2),
                alternateKey:
                    activity.governanceAction === GovernanceAction.DecreaseVotingPower ||
                    activity.governanceAction === GovernanceAction.IncreaseVotingPower
                        ? 'newVotingPower'
                        : 'votingPower',
            },
        }),
    }
</script>

{#each Object.entries(transactionDetailsList) as [key, value]}
    <KeyValueBox keyText={localize(`general.${value.alternateKey ?? key}`)} valueText={value.data} />
{/each}
