<script lang="ts">
    import { ActivityAction, ActivityDirection, ActivityType } from '@core/wallet'
    import ActivityInclusionStatusPill from './ActivityInclusionStatusPill.svelte'
    import { InclusionState } from '@iota/sdk/out/types'

    export let isInternal: boolean
    export let type: ActivityType
    export let direction: ActivityDirection
    export let action: ActivityAction
    export let inclusionState: InclusionState

    let localizationKey: string
    $: {
        if (type === ActivityType.Consolidation) {
            localizationKey = type
        } else if (action === ActivityAction.Send) {
            localizationKey = (isInternal ? 'internal.' : 'external.') + direction
        } else if (action === ActivityAction.Mint || action === ActivityAction.Burn) {
            localizationKey = action
        }
    }
</script>

{#if inclusionState}
    <ActivityInclusionStatusPill {localizationKey} {inclusionState} />
{/if}
