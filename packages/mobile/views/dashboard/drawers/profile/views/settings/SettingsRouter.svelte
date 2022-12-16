<script lang="typescript">
    import { Drawer, StrongholdUnlock } from '../../../../../../components'
    import { SETTINGS_ROUTE_META } from '../../../../../../lib/contexts/dashboard'
    import { settingsRoute, SettingsRoute, settingsRouter } from '../../../../../../lib/routers'
    import { SettingsIndexView } from './views'

    $: needsUnlockStore = $settingsRouter?.getNeedsUnlockStore()

    function onUnlockSuccess(): void {
        $settingsRouter.setNeedsUnlock(false)
    }
</script>

{#if $settingsRoute === SettingsRoute.Init}
    <SettingsIndexView />
{:else}
    <svelte:component this={SETTINGS_ROUTE_META[$settingsRoute].view} />
{/if}

{#if $needsUnlockStore}
    <Drawer onClose={() => $settingsRouter.setNeedsUnlock(false)}>
        <StrongholdUnlock onSuccess={onUnlockSuccess} onCancel={() => $settingsRouter.setNeedsUnlock(false)} />
    </Drawer>
{/if}
