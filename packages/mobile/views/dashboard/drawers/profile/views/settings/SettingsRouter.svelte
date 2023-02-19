<script lang="ts">
    import { Drawer, StrongholdUnlock } from '@components'
    import { SETTINGS_ROUTE_META } from '@/contexts/settings'
    import { settingsRoute, SettingsRoute, settingsRouter } from '../../../../../../lib/routers'
    import { SettingsIndexView } from './views'

    $: needsUnlockStore = $settingsRouter?.getNeedsUnlockStore()
    $: needsUnlockStoreCallbackStore = $settingsRouter?.getNeedsUnlockCallbackStore()
    $: returnPasswordUnlockCallbackStore = $settingsRouter?.getReturnPasswordUnlockCallbackStore()

    function onUnlockSuccess(password?: string): void {
        $settingsRouter.setNeedsUnlock(false, undefined)
        if ($needsUnlockStoreCallbackStore && typeof $needsUnlockStoreCallbackStore === 'function') {
            $needsUnlockStoreCallbackStore(password)
        }
    }
</script>

{#if $settingsRoute === SettingsRoute.Init}
    <SettingsIndexView />
{:else}
    <svelte:component this={SETTINGS_ROUTE_META[$settingsRoute].view} />
{/if}

{#if $needsUnlockStore}
    <Drawer onClose={() => $settingsRouter.setNeedsUnlock(false)}>
        <StrongholdUnlock
            onSuccess={onUnlockSuccess}
            onCancel={() => $settingsRouter.setNeedsUnlock(false, undefined)}
            returnPassword={$returnPasswordUnlockCallbackStore}
        />
    </Drawer>
{/if}
