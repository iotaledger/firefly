<script lang="typescript">
    import { localize } from '@core/i18n'
    import { InclusionState } from '@core/wallet'
    import Pill from './Pill.svelte'

    export let localizationKey: string
    export let inclusionState: InclusionState

    let backgroundColor = 'gray-200'
    let darkBackgroundColor = 'gray-300'
    const textColor = 'gray-800'

    $: {
        switch (inclusionState) {
            case InclusionState.Pending:
                backgroundColor = 'blue-100'
                darkBackgroundColor = 'blue-100'
                break
            case InclusionState.Confirmed:
                backgroundColor = 'green-300'
                darkBackgroundColor = 'green-300'
                break
            case InclusionState.Conflicting:
                backgroundColor = 'red-200'
                darkBackgroundColor = 'red-200'
                break
        }
    }
</script>

{#if localizationKey && inclusionState}
    <Pill {backgroundColor} {darkBackgroundColor} {textColor}>
        {localize(`pills.${localizationKey}.${inclusionState}`).toLowerCase()}
    </Pill>
{/if}
