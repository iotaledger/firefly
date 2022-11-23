<script lang="typescript">
    import { localize } from '@core/i18n'
    import { isStrongholdUnlocked } from '@core/profile-manager'
    import { claimActivity, rejectActivity } from '@core/wallet'
    import { onDestroy } from 'svelte'
    import { Confirmation, StrongholdUnlock } from '../../../../components'
    import { activityRoute, ActivityRoute, activityRouter } from '../../../../lib/routers'
    import { selectedActivity } from '../../../../lib/wallet'
    import { ActivityDetails } from './views'

    export let onClose: () => unknown = () => {}

    function onReject(): void {
        if ($activityRoute === ActivityRoute.Reject) {
            $selectedActivity && rejectActivity($selectedActivity.id)
            onClose()
        } else {
            $activityRouter.next({ route: ActivityRoute.Reject })
        }
    }
    async function onClaim(): Promise<void> {
        const isUnlocked = await isStrongholdUnlocked()
        if (isUnlocked) {
            $selectedActivity && claimActivity($selectedActivity)
            onClose()
        } else {
            $activityRouter.next({ route: ActivityRoute.Password })
        }
    }
    onDestroy(() => {
        $activityRouter.reset()
    })
</script>

{#if $activityRoute === ActivityRoute.Details}
    <ActivityDetails activity={$selectedActivity} {onClaim} {onReject} />
{:else if $activityRoute === ActivityRoute.Reject}
    <Confirmation
        description={localize('actions.confirmRejection.description')}
        hint={localize('actions.confirmRejection.node')}
        confirmText={localize('actions.reject')}
        onConfirm={onReject}
        onCancel={() => $activityRouter.previous()}
        warning
        info
    />
{:else if $activityRoute === ActivityRoute.Password}
    <StrongholdUnlock onSuccess={onClaim} onCancel={() => $activityRouter.previous()} />
{/if}
