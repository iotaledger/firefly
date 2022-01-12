<script lang="typescript">
    import { Icon } from 'shared/components'
    import { isLocaleLoaded } from 'shared/lib/i18n'
    import { dashboardRoute,previousDashboardRoute,settingsChildRoute,settingsRoute } from 'shared/lib/router'
    import type { Locale } from 'shared/lib/typings/i18n'
    import { SettingsRoutes } from 'shared/lib/typings/routes'
    import { onDestroy } from 'svelte'
    import { get } from 'svelte/store'
    import { SettingsHome,SettingsViewer } from './views'

    export let locale: Locale

    export let mobile
    export let handleClose

    function closeSettings() {
        dashboardRoute.set(get(previousDashboardRoute))
        previousDashboardRoute.set(undefined)
    }

    onDestroy(() => {
        // When a new locale is loaded the pages are reloaded
        // so don't reset the router in this case
        if ($isLocaleLoaded) {
            settingsRoute.set(SettingsRoutes.Init)
            settingsChildRoute.set(null)
        }
    })
</script>

<div
    class="relative w-full h-full px-16 py-12 flex flex-1 bg-white dark:bg-gray-900 {$settingsRoute !== SettingsRoutes.Init && 'pt-20'} ">
    <button on:click={handleClose || closeSettings} class="absolute top-8 right-8">
        <Icon icon="close" classes="text-gray-800 dark:text-white" />
    </button>
    {#if $settingsRoute === SettingsRoutes.Init}
        <SettingsHome {mobile} {locale} />
    {:else}
        <SettingsViewer {mobile} {locale} />
    {/if}
</div>
