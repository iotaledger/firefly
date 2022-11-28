<script lang="typescript">
    import { KeyValueBox } from 'shared/components'
    import { localize } from '@core/i18n'
    import { BaseActivity } from '@core/wallet'
    import { parseLayer2Metadata } from '@core/layer-2'

    export let activity: BaseActivity

    $: layer2Metadata = parseLayer2Metadata(activity.metadata)
    $: detailsList = createDetailsList(layer2Metadata)

    function createDetailsList(metadata: typeof layer2Metadata): { [key: string]: { data: unknown } } {
        return {
            ...(metadata?.targetContract && {
                targetContract: { data: metadata.targetContract },
            }),
            ...(metadata?.contractFunction && {
                contractFunction: { data: metadata.contractFunction },
            }),
            ...(metadata?.gasBudget && {
                gasBudget: { data: metadata.gasBudget },
            }),
        }
    }
</script>

{#each Object.entries(detailsList) as [key, value]}
    <KeyValueBox keyText={localize(`general.${key}`)} valueText={value.data} isCopyable />
{/each}
