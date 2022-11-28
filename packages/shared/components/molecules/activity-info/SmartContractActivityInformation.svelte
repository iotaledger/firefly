<script lang="typescript">
    import { KeyValueBox } from 'shared/components'
    import { localize } from '@core/i18n'
    import { formatTokenAmountPrecise, TransactionActivity } from '@core/wallet'
    import { Layer2Metadata } from '@core/layer-2'
    import { BASE_TOKEN } from '@core/network'
    import { activeProfile } from '@core/profile'

    export let activity: TransactionActivity

    $: detailsList = createDetailsList(activity.parsedLayer2Metadata)
    $: formattedGasBudget = formatTokenAmountPrecise(
        Number(activity.parsedLayer2Metadata?.gasBudget) ?? 0,
        BASE_TOKEN[$activeProfile?.networkProtocol]
    )

    function createDetailsList(metadata: Layer2Metadata): { [key: string]: { data: unknown } } {
        return {
            ...(metadata?.targetContract && {
                targetContract: { data: metadata.targetContract },
            }),
            ...(metadata?.contractFunction && {
                contractFunction: { data: metadata.contractFunction },
            }),
            ...(metadata?.gasBudget && {
                gasBudget: { data: formattedGasBudget },
            }),
        }
    }
</script>

{#each Object.entries(detailsList) as [key, value]}
    <KeyValueBox keyText={localize(`general.${key}`)} valueText={value.data} isCopyable />
{/each}
