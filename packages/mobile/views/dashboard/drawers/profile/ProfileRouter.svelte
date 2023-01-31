<script lang="ts">
    import { Drawer, StrongholdUnlock } from '../../../../components'
    import { ProfileRoute, profileRoute, profileRouter } from '../../../../lib/routers'
    import { ActionsView, BackupProfileView, NetworkStatusView, SettingsView } from './views'

    $: needsUnlockStore = $profileRouter?.getNeedsUnlockStore()
    $: needsUnlockStoreCallbackStore = $profileRouter?.getNeedsUnlockCallbackStore()
    $: returnPasswordUnlockCallbackStore = $profileRouter?.getReturnPasswordUnlockCallbackStore()
    function onUnlockSuccess(password?: string): void {
        $profileRouter.setNeedsUnlock(false, undefined)
        if ($needsUnlockStoreCallbackStore && typeof $needsUnlockStoreCallbackStore === 'function') {
            $needsUnlockStoreCallbackStore(password)
        }
    }
</script>

{#if $profileRoute === ProfileRoute.Actions}
    <ActionsView />
{:else if $profileRoute === ProfileRoute.Backup}
    <BackupProfileView />
{:else if $profileRoute === ProfileRoute.NetworkStatus}
    <NetworkStatusView />
{:else if $profileRoute === ProfileRoute.Settings}
    <SettingsView />
{/if}

{#if $needsUnlockStore}
    <Drawer onClose={() => $profileRouter.setNeedsUnlock(false)}>
        <StrongholdUnlock
            onSuccess={onUnlockSuccess}
            onCancel={() => $profileRouter.setNeedsUnlock(false, undefined)}
            returnPassword={$returnPasswordUnlockCallbackStore}
        />
    </Drawer>
{/if}
