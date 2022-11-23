<script lang="typescript">
    import { activityRoute, ActivityRoute } from '../../../../lib/routers'
    import { StrongholdUnlock } from '../../../../components'
    import { claimActivity } from '@core/wallet'
    import { selectedActivity } from '../../../../lib/contexts/dashboard'

    export let onClose: () => unknown = () => {}

    function onConfirm(): void {
        $selectedActivity && claimActivity($selectedActivity)
        onClose()
    }
</script>

{#if $activityRoute === ActivityRoute.Details}
    <p>Details</p>
{:else if $activityRoute === ActivityRoute.Reject}
    <p>Reject</p>
{:else if $activityRoute === ActivityRoute.Password}
    <StrongholdUnlock onSuccess={onConfirm} onCancel={onClose} />
{/if}
