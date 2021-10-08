<script lang="typescript">
    import { Drawer, Icon, Logo, NetworkIndicator, ProfileActionsModal, Text } from 'shared/components'
    import { mobile } from 'shared/lib/app'
    import { getInitials } from 'shared/lib/helpers'
    import { networkStatus } from 'shared/lib/networkStatus'
    import { activeProfile } from 'shared/lib/profile'
    import { dashboardRoute, resetWalletRoute, settingsRoute } from 'shared/lib/router'
    import { SettingsRoutes, Tabs } from 'shared/lib/typings/routes'
    import { Settings } from 'shared/routes'
    import { onDestroy } from 'svelte'
    import { get } from 'svelte/store'
    import { Locale } from 'shared/lib/typings/i18n'

    export let locale: Locale

    let showNetwork = false
    let healthStatus = 2
    let showProfile = false
    let drawer: Drawer
    const profileColor = 'blue' // TODO: each profile has a different color

    const NETWORK_HEALTH_COLORS = {
        0: 'red',
        1: 'yellow',
        2: 'green',
    }

    const profileInitial = getInitials(get(activeProfile)?.name, 1)

    const unsubscribe = networkStatus.subscribe((data) => {
        healthStatus = data.health ?? 0
    })

    onDestroy(() => {
        unsubscribe()
    })

    function openSettings() {
        dashboardRoute.set(Tabs.Settings)
        settingsRoute.set(SettingsRoutes.Init)
    }

    function openWallet() {
        resetWalletRoute()
    }

    function handleBackClick() {
        if ($settingsRoute === SettingsRoutes.Init) {
            drawer.close()
        } else {
            settingsRoute.set(SettingsRoutes.Init)
        }
    }

    const hasTitleBar = document.body.classList.contains('platform-win32')
</script>

<style type="text/scss">
    :global(body.platform-win32) aside {
        @apply -top-12;
        @apply pt-12;
    }
</style>

{#if $mobile}
    <button
        class="absolute top-10 right-8 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-{profileColor}-500 leading-100"
        on:click={() => drawer.open()}>
        <span class="text-12 text-center text-white uppercase">{profileInitial || 'A'}</span>
    </button>
    <Drawer bind:this={drawer} fromRight={true} dimLength={0} opened={false} fullScreen classes="flex">
        <div class="flex flex-col flex-1">
            <div
                class="cursor-pointer w-full px-8 py-3 mb-6 flex items-centers justify-center bg-white dark:bg-gray-800"
                on:click={handleBackClick}>
                <Icon icon="arrow-left" classes="absolute left-6 text-gray-500 text-blue-500" />
                <Text type="h4" classes="text-center">
                    {locale($settingsRoute === SettingsRoutes.Init ? 'general.yourWallets' : `views.settings.${$settingsRoute}.title`)}
                </Text>
            </div>
            {#if $settingsRoute === SettingsRoutes.Init}
                <!-- TODO: add real profile data -->
                <div class="flex flex-row items-center space-x-6 mb-7 px-6 w-full">
                    <div class="w-16 h-16 flex items-center justify-center rounded-full bg-{profileColor}-500 leading-100">
                        <span class="text-20 text-center text-white uppercase font-semibold">{profileInitial || 'A'}</span>
                    </div>
                    <Text type="h4">John Doe</Text>
                </div>
            {/if}
            <Settings {locale} />
        </div>
    </Drawer>
{:else}
    <aside
        class="flex flex-col justify-center items-center bg-white dark:bg-gray-800 h-screen relative w-20 px-5 pb-9 pt-9 border-solid border-r border-gray-100 dark:border-gray-800">
        <Logo classes="logo mb-9 {hasTitleBar ? 'mt-3' : ''}" width="48px" logo="logo-firefly" />
        <nav class="flex flex-grow flex-col items-center justify-between">
            <button class={$dashboardRoute === Tabs.Wallet ? 'text-blue-500' : 'text-gray-500'} on:click={() => openWallet()}>
                <Icon icon="wallet" />
            </button>
            <span class="flex flex-col items-center">
                <button class="mb-7 health-status" on:click={() => (showNetwork = true)}>
                    <Icon icon="network" classes="text-{NETWORK_HEALTH_COLORS[healthStatus]}-500" />
                </button>
                <button
                    class="w-8 h-8 flex items-center justify-center rounded-full bg-{profileColor}-500 leading-100"
                    on:click={() => (showProfile = true)}>
                    <span class="text-12 text-center text-white uppercase">{profileInitial}</span>
                </button>
            </span>
        </nav>
        <NetworkIndicator bind:isActive={showNetwork} {locale} />
        <ProfileActionsModal bind:isActive={showProfile} {locale} {openSettings} />
    </aside>
{/if}
