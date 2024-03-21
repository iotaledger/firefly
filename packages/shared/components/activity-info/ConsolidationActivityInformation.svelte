<script lang="ts">
    import { KeyValueBox } from '@ui'
    import { getFormattedTimeStamp, localize } from '@core/i18n'
    import { ActivityConsolidation } from '@core/wallet'
    import { IKeyValueBoxList } from '@core/utils'

    export let activity: ActivityConsolidation

    let transactionDetailsList: IKeyValueBoxList
    $: transactionDetailsList = {
        ...(activity.time && {
            transactionTime: { data: getFormattedTimeStamp(activity.time()) },
        }),
        ...(activity.amountConsolidatedInputs && {
            amountConsolidatedInputs: { data: String(activity.amountConsolidatedInputs()) },
        }),
    }
</script>

{#each Object.entries(transactionDetailsList) as [key, value]}
    <KeyValueBox keyText={localize(`general.${key}`)} valueText={value.data} />
{/each}
