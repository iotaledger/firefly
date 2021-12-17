<script lang="typescript">
    import { Icon, Logo, NetworkIndicator, ProfileActionsModal } from 'shared/components'
    import { getInitials } from 'shared/lib/helpers'
    import { networkStatus, NETWORK_HEALTH_COLORS } from 'shared/lib/networkStatus'
    import { isStakingPossible } from 'shared/lib/participation'
    import { stakingEventState, unstakedAmount } from 'shared/lib/participation/stores'
    import { activeProfile } from 'shared/lib/profile'
    import { dashboardRoute, previousDashboardRoute, resetWalletRoute, settingsRoute } from 'shared/lib/router'
    import type { Locale } from 'shared/lib/typings/i18n'
    import { SettingsRoutes, Tabs } from 'shared/lib/typings/routes'
    import { onDestroy } from 'svelte'
    import { get } from 'svelte/store'

    export let locale: Locale

    let showNetwork = false
    let healthStatus = 2
    let showProfile = false
    let _prevUnstakedAmount = 0 // store the previous unstaked funds to avoid notifying when unstaked funds decrease
    let showStakingNotification = false

    const profileColor = 'blue' // TODO: each profile has a different color

    const profileInitial = getInitials(get(activeProfile)?.name, 1)

    const unsubscribeNetworkStatus = networkStatus.subscribe((data) => {
        healthStatus = data.health ?? 0
    })

    const unSubscribePartialStaking = unstakedAmount.subscribe((_unstakedAmount) => {
        if (
            isStakingPossible($stakingEventState) &&
            _unstakedAmount > _prevUnstakedAmount &&
            $dashboardRoute !== Tabs.Staking
        ) {
            showStakingNotification = true
        } else {
            showStakingNotification = false
        }
        _prevUnstakedAmount = _unstakedAmount
    })

    $: if ($dashboardRoute === Tabs.Staking) showStakingNotification = false

    onDestroy(() => {
        unsubscribeNetworkStatus()
        unSubscribePartialStaking()
    })

    function openSettings() {
        previousDashboardRoute.set(get(dashboardRoute))
        dashboardRoute.set(Tabs.Settings)
        settingsRoute.set(SettingsRoutes.Init)
    }

    function openWallet() {
        resetWalletRoute()
    }

    function openStaking() {
        dashboardRoute.set(Tabs.Staking)
    }

    const hasTitleBar = document.body.classList.contains('platform-win32')
</script>

<style type="text/scss">
    :global(body.platform-win32) aside {
        @apply -top-12;
        @apply pt-12;
    }
</style>

<aside
    class="flex flex-col justify-center items-center bg-white dark:bg-gray-800 h-screen relative w-20 px-5 pb-9 pt-9 border-solid border-r border-gray-100 dark:border-gray-800">
    <Logo classes="logo mb-9 {hasTitleBar ? 'mt-3' : ''}" width="48px" logo="logo-firefly" />
    <nav class="flex flex-grow flex-col items-center justify-between">
        <div class="flex flex-col">
            <button
                class="mb-8 {$dashboardRoute === Tabs.Wallet ? 'text-blue-500' : 'text-gray-500'}"
                on:click={openWallet}>
                <Icon width="24" height="24" icon="wallet" />
            </button>
            <button
                class="{$dashboardRoute === Tabs.Staking ? 'text-blue-500' : 'text-gray-500'} relative"
                on:click={openStaking}>
                <Icon width="24" height="24" icon="tokens" />
                {#if !$activeProfile?.hasVisitedStaking || showStakingNotification}
                    <span class="absolute -top-2 -left-2 flex justify-center items-center h-3 w-3">
                        <span
                            class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-300 opacity-75" />
                        <span class="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                    </span>
                {/if}
            </button>
        </div>
        <span class="flex flex-col items-center">
            <button class="mb-7 health-status" on:click={() => (showNetwork = true)}>
                <Icon width="24" height="24" icon="network" classes="text-{NETWORK_HEALTH_COLORS[healthStatus]}-500" />
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
