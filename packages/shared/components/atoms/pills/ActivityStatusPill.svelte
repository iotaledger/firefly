<script lang="typescript">
    import { localize } from '@core/i18n'
    import { ActivityDirection, ActivityType, InclusionState } from '@core/wallet'
    import Pill from './Pill.svelte'

    export let type: ActivityType
    export let isInternal: boolean
    export let direction: ActivityDirection
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

{#if type && inclusionState}
    <Pill {backgroundColor} {darkBackgroundColor} {textColor}>
        {localize(
            'pills.' + type + '.' + (isInternal ? 'internal' : 'external') + '.' + direction + '.' + inclusionState
        ).toLowerCase()}
    </Pill>
{/if}
