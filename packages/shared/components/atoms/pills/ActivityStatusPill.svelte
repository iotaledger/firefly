<script lang="typescript">
    import { localize } from '@core/i18n'
    import { ActivityStatus, ActivityType, InclusionState } from '@core/wallet'
    import Pill from './Pill.svelte'

    export let type: ActivityType
    export let inclusionState: InclusionState

    let backgroundColor = 'gray-200'
    let darkBackgroundColor = 'gray-300'
    const textColor = 'gray-800'

    $: {
        switch (inclusionState) {
            case InclusionState.Pending:
                backgroundColor = 'blue-200'
                darkBackgroundColor = 'blue-300'
                break
            case InclusionState.Confirmed:
                backgroundColor = 'green-200'
                darkBackgroundColor = 'green-300'
                break
            case InclusionState.Conflicting:
                backgroundColor = 'red-200'
                darkBackgroundColor = 'red-300'
                break
        }
    }
</script>

{#if type && inclusionState}
    <Pill {backgroundColor} {darkBackgroundColor} {textColor}>
        {localize('pills.' + type + '.' + inclusionState).toLowerCase()}
    </Pill>
{/if}
