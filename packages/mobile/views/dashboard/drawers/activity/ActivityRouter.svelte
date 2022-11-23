<script lang="typescript">
    import { localize } from '@core/i18n'
    import { isStrongholdUnlocked } from '@core/profile-manager'
    import { Activity } from '@core/wallet'
    import { onDestroy } from 'svelte'
    import { Confirmation, StrongholdUnlock } from '../../../../components'
    import { activityRoute, ActivityRoute, activityRouter } from '../../../../lib/routers'
    import { ActivityDetails } from './views'

    export let activity: Activity

    function onReject(): void {
        $activityRouter.next({ action: 'reject' })
    }
    async function onClaim(): Promise<void> {
        const isUnlocked = await isStrongholdUnlocked()
        $activityRouter.next({ action: 'claim', isUnlocked })
    }
    onDestroy(() => {
        $activityRouter.reset()
    })
</script>

{#if $activityRoute === ActivityRoute.Details}
    <ActivityDetails {activity} {onClaim} {onReject} />
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
