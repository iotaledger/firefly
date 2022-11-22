<script lang="typescript">
    import { localize } from '@core/i18n'
    import { claimActivity, rejectActivity } from '@core/wallet'
    import { onMount } from 'svelte'
    import { Confirmation, StrongholdUnlock } from '../../../../components'
    import { activityRoute, ActivityRoute, activityRouter } from '../../../../lib/routers'
    import { selectedActivity } from '../../../../lib/wallet'
    import { ActivityDetails } from './views'

    export let onClose: () => unknown = () => {}

    let detailsVisible = false

    function onClaim(): void {
        $selectedActivity && claimActivity($selectedActivity)
        handleClose()
    }
    function onReject(): void {
        $selectedActivity && rejectActivity($selectedActivity.id)
        handleClose()
    }
    function handleClose(): void {
        if (detailsVisible) {
            $activityRouter.previous()
        } else {
            onClose()
        }
    }

    onMount(() => {
        detailsVisible = $activityRoute === ActivityRoute.Details
    })
</script>

{#if $activityRoute === ActivityRoute.Details}
    <ActivityDetails activity={$selectedActivity} />
{:else if $activityRoute === ActivityRoute.Reject}
    <Confirmation
        description={localize('actions.confirmRejection.description')}
        hint={localize('actions.confirmRejection.node')}
        confirmText={localize('actions.reject')}
        onConfirm={onReject}
        onCancel={handleClose}
        warning
        info
    />
{:else if $activityRoute === ActivityRoute.Password}
    <StrongholdUnlock onSuccess={onClaim} onCancel={handleClose} />
{/if}
