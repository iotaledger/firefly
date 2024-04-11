<script lang="ts">
    import { KeyValueBox } from '@ui'
    import { localize } from '@core/i18n'
    import { DelegationActivity, EMPTY_HEX_ID, formatTokenAmountBestMatch } from '@core/wallet'
    import { getBaseToken } from 'shared/lib/core/profile'
    import { api } from '@core/api'

    export let activity: DelegationActivity

    const formattedAmount = formatTokenAmountBestMatch(activity.delegatedAmount, getBaseToken()).toString()

    let delegationId = activity.delegationId
    let detailsList: { [key in string]: string }

    $: {
        if (delegationId === EMPTY_HEX_ID) {
            delegationId = api.computeDelegationId(activity.outputId)
        }
    }

    $: detailsList = {
        validatorAddress: activity.validatorAddress,
        delegatedAmount: formattedAmount,
        delegationId: delegationId,
        startEpoch: activity.startEpoch.toString(),
    }
</script>

{#each Object.entries(detailsList) as [key, value]}
    <KeyValueBox keyText={localize(`general.${key}`)} valueText={value} isCopyable />
{/each}
