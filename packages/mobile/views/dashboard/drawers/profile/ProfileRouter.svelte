<script lang="typescript">
    import { Drawer, StrongholdUnlock } from '../../../../components'
    import { ProfileRoute, profileRoute, profileRouter } from '../../../../lib/routers'
    import { ActionsView, BackupProfileView, NetworkStatusView, SettingsView } from './views'

    $: needsUnlockStore = $profileRouter?.getNeedsUnlockStore()

    function closeStrongholdUnlock(): void {
        $profileRouter.setNeedsUnlock(false, undefined)
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
    <Drawer onClose={closeStrongholdUnlock}>
        <StrongholdUnlock onSuccess={closeStrongholdUnlock} onCancel={closeStrongholdUnlock} />
    </Drawer>
{/if}
