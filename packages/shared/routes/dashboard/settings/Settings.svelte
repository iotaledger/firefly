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

    const profileColor = 'blue' // TODO: each profile has a different color

    /**
     * Scroll top each time a route changes
     * Mobile only
     */
    $: $mobile, $dashboardRoute, $settingsChildRoute, scrollTop()

    function handleBackClick() {
        if ($settingsRoute === SettingsRoutes.Init) {
            closeSettings()
        } else {
            settingsRoute.set(SettingsRoutes.Init)
            settingsChildRoute.set(null)
        }
    }

    function closeSettings() {
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
    <Drawer fromRight dimLength={0} fullScreen classes="flex">
        <div class="flex w-full h-full relative z-0 pt-20">
            <div
                class="fixed top-0 cursor-pointer w-full px-8 py-3 flex items-centers justify-center bg-white dark:bg-gray-800"
                on:click={handleBackClick}>
                <Icon icon="arrow-left" classes="absolute left-6 text-gray-500 text-blue-500" />
                <Text type="h4" classes="text-center">
                    {localize($settingsRoute === SettingsRoutes.Init ? 'general.yourWallets' : `views.settings.${$settingsChildRoute}.title`)}
                </Text>
            </div>
            <div class="flex-1 overflow-y-auto px-6" id="scroller">
                {#if $settingsRoute === SettingsRoutes.Init}
                    <!-- TODO: remove dummy data -->
                    <div class="flex flex-row items-center space-x-6 mb-7 w-full">
                        <div
                            class="w-16 h-16 flex items-center justify-center rounded-full bg-{profileColor}-500 leading-100">
                            <span
                                class="text-20 text-center text-white uppercase font-semibold">{getInitials($activeProfile?.name, 1) || 'J'}</span>
                        </div>
                        <Text type="h4">{$activeProfile?.name || 'John Doe'}</Text>
                    </div>
                {/if}
                {#if $settingsRoute === SettingsRoutes.Init}
                    <SettingsHome />
                {:else}
                    <SettingsViewer />
                {/if}
            </div>
        </div>
    </Drawer>
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
