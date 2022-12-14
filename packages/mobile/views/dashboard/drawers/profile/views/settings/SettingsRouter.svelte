<script lang="typescript">
    import { localize } from '@core/i18n'
    import features from '@features/features'
    import { Drawer, StrongholdUnlock } from '../../../../../../components'
    import { SettingsCategory, SETTINGS_ROUTE_META } from '../../../../../../lib/contexts/dashboard'
    import { settingsRoute, SettingsRoute, settingsRouter } from '../../../../../../lib/routers'
    import { SettingsIndexView } from './views'

    $: needsUnlockStore = $settingsRouter?.getNeedsUnlockStore()

    const categories = {
        [SettingsCategory.General]: {
            name: localize('views.settings.general.title'),
            enabled: features.settings.general.enabled,
            settings: [],
        },
        [SettingsCategory.Security]: {
            name: localize('views.settings.security.title'),
            enabled: features.settings.security.enabled,
            settings: [],
        },
        [SettingsCategory.Advanced]: {
            name: localize('views.settings.advanced.title'),
            enabled: features.settings.advanced.enabled,
            settings: [],
        },
        [SettingsCategory.HelpAndInfo]: {
            name: localize('views.settings.helpAndInfo.title'),
            enabled: features.settings.helpAndInfo.enabled,
            settings: [],
        },
    }

    for (const [route, setting] of Object.entries(SETTINGS_ROUTE_META)) {
        if (categories[setting.category].enabled) {
            const listItem = { ...setting, route }
            categories[setting.category].settings.push(listItem)
        }
    }

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
