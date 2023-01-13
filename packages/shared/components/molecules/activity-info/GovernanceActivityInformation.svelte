<script lang="typescript">
    import { KeyValueBox } from 'shared/components'
    import { formatDate, localize } from '@core/i18n'
    import { formatTokenAmountBestMatch, GovernanceActivity } from '@core/wallet'
    import { activeProfile } from '@core/profile'
    import { BASE_TOKEN } from '@core/network'

    export let activity: GovernanceActivity

    $: formattedTransactionTime = getDateFormat(activity.time)

    let transactionDetailsList: { [key in string]: { data: string } }
    $: transactionDetailsList = {
        ...(activity.time && {
            transactionTime: { data: formattedTransactionTime },
        }),
        ...(activity.metadata && {
            metadata: { data: activity.metadata },
        }),
        ...(activity.votingPower && {
            votingPower: { data: getAmount() },
        }),
    }

    function getAmount(): string {
        const metadata = BASE_TOKEN[$activeProfile?.networkProtocol]
        return formatTokenAmountBestMatch(activity.votingPower, metadata, 2)
    }

    function getDateFormat(date: Date): string {
        try {
            if (date) {
                return formatDate(date, {
                    dateStyle: 'long',
                    timeStyle: 'medium',
                })
            } else {
                return undefined
            }
        } catch (err) {
            return undefined
        }
    }
</script>

{#each Object.entries(transactionDetailsList) as [key, value]}
    <KeyValueBox keyText={localize(`general.${key}`)} valueText={value.data} />
{/each}
