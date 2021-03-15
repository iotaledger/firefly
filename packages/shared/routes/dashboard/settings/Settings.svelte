<script lang="typescript">
    import { appSettings } from 'shared/lib/appSettings'
    import { deepLinkRequestActive } from 'shared/lib/deepLinking'
    import { isLocaleLoaded } from 'shared/lib/i18n'
    import { settingsRoute } from 'shared/lib/router'
    import { SettingsRoutes } from 'shared/lib/typings/routes'
    import { onDestroy } from 'svelte'
    import { SettingsHome, SettingsViewer } from './views'

    export let locale
    export let mobile

    $: {
        if ($deepLinkRequestActive && !$appSettings.deepLinking) {
            settingsRoute.set(SettingsRoutes.AdvancedSettings)
            deepLinkRequestActive.set(false)
        }
    }

    onDestroy(() => {
        // When a new locale is loaded the pages are reloaded
        // so don't reset the router in this case
        if ($isLocaleLoaded) {
            settingsRoute.set(SettingsRoutes.Init)
        }
    })
</script>

<div class="w-full h-full px-16 py-12 flex flex-1 bg-white">
    {#if $settingsRoute === SettingsRoutes.Init}
        <SettingsHome {mobile} {locale} />
    {:else}
        <SettingsViewer {mobile} {locale} />
    {/if}
</div>
