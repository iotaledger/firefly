<script lang="ts">
    import { localize } from '@core/i18n'
    import { InclusionState } from '@core/wallet'
    import Pill from './Pill.svelte'

    export let localizationKey: string
    export let inclusionState: InclusionState

    let backgroundColor = 'bg-gray-200 dark:bg-gray-300'
    const textColor = 'gray-800'

    $: {
        switch (inclusionState) {
            case InclusionState.Pending:
                backgroundColor = 'bg-blue-100 dark:bg-blue-100'
                break
            case InclusionState.Confirmed:
                backgroundColor = 'bg-green-300 dark:bg-green-300'
                break
            case InclusionState.Conflicting:
                backgroundColor = 'bg-red-200 dark:bg-red-200'
                break
        }
    }
</script>

{#if localizationKey && inclusionState}
    <Pill {backgroundColor} {textColor}>
        {localize(`pills.${localizationKey}.${inclusionState}`)}
    </Pill>
{/if}
