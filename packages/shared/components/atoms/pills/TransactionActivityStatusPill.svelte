<script lang="typescript">
    import { ActivityAction, ActivityDirection, InclusionState } from '@core/wallet'
    import ActivityInclusionStatusPill from './ActivityInclusionStatusPill.svelte'

    export let isInternal: boolean
    export let direction: ActivityDirection
    export let action: ActivityAction
    export let inclusionState: InclusionState

    let localizationKey: string
    $: {
        if (action === ActivityAction.Send) {
            localizationKey = (isInternal ? 'internal.' : 'external.') + direction
        } else if (action === ActivityAction.Mint) {
            localizationKey = action
        }
    }
</script>

{#if inclusionState}
    <ActivityInclusionStatusPill {localizationKey} {inclusionState} />
{/if}
