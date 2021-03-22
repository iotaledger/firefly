<script lang="typescript">
    import { Icon, Logo, NetworkIndicator, ProfileActionsModal } from 'shared/components'
    import { getInitials } from 'shared/lib/helpers'
    import { networkStatus } from 'shared/lib/networkStatus'
    import { activeProfile } from 'shared/lib/profile'
    import { dashboardRoute, settingsRoute, resetWalletRoute } from 'shared/lib/router'
    import { SettingsRoutes, Tabs } from 'shared/lib/typings/routes'
    import { onDestroy } from 'svelte'
    import { get } from 'svelte/store'

    export let locale

    let showNetwork = false
    let healthStatus = 2
    let showProfile = false
    let profileColor = 'blue' // TODO: each profile has a different color

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

    const hasTitleBar = document.body.classList.contains(`platform-win32`)
</script>

<style type="text/scss">
    :global(body.platform-win32) aside {
        @apply -top-12;
        @apply pt-12;
    }
</style>

<aside
    class="flex flex-col justify-center items-center bg-white dark:bg-gray-800 h-screen relative w-20 px-5 pb-9 pt-9 border-solid border-r border-gray-100 dark:border-gray-800">
    <Logo classes="logo mb-9 {hasTitleBar ? "mt-3": ""}" width="48px" logo="logo-firefly" />
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
