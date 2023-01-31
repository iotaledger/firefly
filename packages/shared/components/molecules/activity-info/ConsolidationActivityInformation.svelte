<script lang="ts">
    import { KeyValueBox } from 'shared/components'
    import { getFormattedTimeStamp, localize } from '@core/i18n'
    import { ConsolidationActivity } from '@core/wallet'
    import { IKeyValueBoxList } from '@core/utils'

    export let activity: ConsolidationActivity

    let transactionDetailsList: IKeyValueBoxList
    $: transactionDetailsList = {
        ...(activity.time && {
            transactionTime: { data: getFormattedTimeStamp(activity.time) },
        }),
        ...(activity.amountConsolidatedInputs && {
            amountConsolidatedInputs: { data: String(activity.amountConsolidatedInputs) },
        }),
    }
</script>

{#each Object.entries(transactionDetailsList) as [key, value]}
    <KeyValueBox keyText={localize(`general.${key}`)} valueText={value.data} />
{/each}
