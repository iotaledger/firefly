<script lang="typescript">
    import { ActivityDirection, ActivityType, InclusionState } from '@core/wallet'
    import ActivityInclusionStatusPill from './ActivityInclusionStatusPill.svelte'

    export let type: ActivityType
    export let isInternal: boolean
    export let direction: ActivityDirection
    export let inclusionState: InclusionState
</script>

{#if type && inclusionState}
    <ActivityInclusionStatusPill
        localizationKey={type + '.' + (isInternal ? 'internal' : 'external') + '.' + direction}
        {inclusionState}
    />
{/if}
