<script lang="typescript">
    import { Drawer, StrongholdUnlock } from '../../../../../../components'
    import { settingsRoute, SettingsRoute, settingsRouter } from '../../../../../../lib/routers'
    import { SettingsIndexView, SettingsPasswordView } from './views'

    $: needsUnlockStore = $settingsRouter?.getNeedsUnlockStore()

    function onUnlockSuccess(): void {
        $settingsRouter.setNeedsUnlock(false)
    }
</script>

{#if $settingsRoute === SettingsRoute.Init}
    <SettingsIndexView />
{:else if $settingsRoute === SettingsRoute.ChangePassword}
    <SettingsPasswordView />
{/if}

{#if $needsUnlockStore}
    <Drawer onClose={() => $settingsRouter.setNeedsUnlock(false)}>
        <StrongholdUnlock onSuccess={onUnlockSuccess} onCancel={() => $settingsRouter.setNeedsUnlock(false)} />
    </Drawer>
{/if}
