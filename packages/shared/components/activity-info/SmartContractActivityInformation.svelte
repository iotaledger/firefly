<script lang="ts">
    import { KeyValueBox } from '@ui'
    import { localize } from '@core/i18n'
    import { TransactionActivity } from '@core/wallet'
    import { Layer2Metadata } from '@core/layer-2'

    export let activity: TransactionActivity

    $: detailsList = createDetailsList(activity.parsedLayer2Metadata)

    function createDetailsList(metadata: Layer2Metadata): { [key: string]: { data: string } } {
        return {
            ...(metadata?.targetContract && {
                targetContract: { data: metadata.targetContract },
            }),
            ...(metadata?.contractFunction && {
                contractFunction: { data: metadata.contractFunction },
            }),
        }
    }
</script>

{#each Object.entries(detailsList) as [key, value]}
    <KeyValueBox keyText={localize(`general.${key}`)} valueText={value.data} isCopyable />
{/each}
