<script lang="typescript">
    import { Drawer, Icon, Text } from 'shared/components'
    import { mobile } from 'shared/lib/app'
    import { getInitials } from 'shared/lib/helpers'
    import { isLocaleLoaded, localize } from 'shared/lib/i18n'
    import { activeProfile } from 'shared/lib/profile'
    import { dashboardRoute, previousDashboardRoute, settingsChildRoute, settingsRoute } from 'shared/lib/router'
    import { SettingsRoutes, Tabs } from 'shared/lib/typings/routes'
    import { onDestroy } from 'svelte'
    import { get } from 'svelte/store'
    import { SettingsHome, SettingsViewer } from './views'

    export let handleClose: () => void

    let drawer: Drawer
    /**
     * Scroll top each time a route changes
     * Mobile only
     */
    $: $mobile, $dashboardRoute, $settingsChildRoute, scrollTop()

    async function closeSettings() {
        await drawer.close()
        dashboardRoute.set(get(previousDashboardRoute))
        previousDashboardRoute.set(undefined)
    }

    function scrollTop() {
        if ($mobile && ($dashboardRoute === Tabs.Settings || $settingsChildRoute)) {
            const scroller = document.getElementById('scroller')
            if (scroller) {
                scroller.scrollTop = 0
            }
        }
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

{#if $mobile}
    <div class="flex-1 overflow-y-auto px-7" id="scroller">
        {#if $settingsRoute === SettingsRoutes.Init}
            <SettingsHome />
        {:else}
            <SettingsViewer />
        {/if}
    </div>
{:else}
    <div
        class="relative h-full w-full px-6 pb-10 md:px-16 md:py-12 md:bg-white md:dark:bg-gray-900 flex flex-1 {$settingsRoute !== SettingsRoutes.Init && 'md:pt-20'} ">
        <button on:click={handleClose || closeSettings} class="absolute top-8 right-8">
            <Icon icon="close" classes="text-gray-800 dark:text-white" />
        </button>
        {#if $settingsRoute === SettingsRoutes.Init}
            <SettingsHome />
        {:else}
            <SettingsViewer />
        {/if}
    </div>
{/if}
