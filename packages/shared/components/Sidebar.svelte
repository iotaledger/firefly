<script lang="typescript">
    import { Drawer, Icon, Logo, NetworkIndicator, ProfileActionsModal, Text } from 'shared/components'
    import { mobile } from 'shared/lib/app'
    import { getInitials } from 'shared/lib/helpers'
    import { networkStatus, NETWORK_HEALTH_COLORS } from 'shared/lib/networkStatus'
    import { isStakingPossible } from 'shared/lib/participation'
    import { partiallyUnstakedAmount, stakingEventState } from 'shared/lib/participation/stores'
    import { activeProfile } from 'shared/lib/profile'
    import { dashboardRoute, resetWalletRoute, settingsRoute } from 'shared/lib/router'
    import { SettingsRoutes, Tabs } from 'shared/lib/typings/routes'
    import { Settings } from 'shared/routes'
    import { Locale } from 'shared/lib/typings/i18n'

    export let locale: Locale

    let showNetwork = false
    let showProfile = false
    let drawer: Drawer
    let prevPartiallyUnstakedAmount = 0 // store the previous unstaked funds to avoid notifying when unstaked funds decrease
    let showStakingNotification = false

    const hasTitleBar = document.body.classList.contains('platform-win32')
    const profileColor = 'blue' // TODO: each profile has a different color

    $: profileInitial = getInitials($activeProfile?.name, 1)
    $: healthStatus = $networkStatus.health ?? 0
    $: $dashboardRoute, $stakingEventState, $partiallyUnstakedAmount, manageUnstakedAmountNotification()

    function manageUnstakedAmountNotification() {
        if (isStakingPossible($stakingEventState)) {
            if ($dashboardRoute !== Tabs.Staking && $partiallyUnstakedAmount > prevPartiallyUnstakedAmount) {
                showStakingNotification = true
            } else {
                showStakingNotification = false
            }
            prevPartiallyUnstakedAmount = $partiallyUnstakedAmount
        } else {
            showStakingNotification = false
        }
    }

    function openWallet() {
        resetWalletRoute()
    }

    function handleBackClick() {
        if ($settingsRoute === SettingsRoutes.Init) {
            drawer?.close()
        } else {
            settingsRoute.set(SettingsRoutes.Init)
        }
    }

    function openStaking() {
        dashboardRoute.set(Tabs.Staking)
    }
</script>

{#if $mobile}
    <button
        class="menu-button z-10 w-9 h-9 flex items-center justify-center rounded-full bg-{profileColor}-500 leading-100"
        on:click={() => drawer.open()}
    >
        <span class="text-12 text-center text-white uppercase">{profileInitial || 'A'}</span>
    </button>
    <Drawer bind:this={drawer} fromRight={true} dimLength={0} opened={false} fullScreen classes="flex">
        <div class="flex flex-col flex-1">
            <header
                class="w-full px-8 py-3 mb-6 flex items-centers justify-center bg-white dark:bg-gray-800"
                on:click={handleBackClick}
            >
                <Icon icon="arrow-left" classes="absolute left-6 text-gray-500 text-blue-500" />
                <Text type="h4" classes="text-center">
                    {locale(
                        $settingsRoute === SettingsRoutes.Init
                            ? 'general.yourWallets'
                            : `views.settings.${$settingsRoute}.title`
                    )}
                </Text>
            </header>
            {#if $settingsRoute === SettingsRoutes.Init}
                <!-- TODO: add real profile data -->
                <div class="flex flex-row items-center space-x-6 mb-7 px-6 w-full">
                    <div
                        class="w-16 h-16 flex items-center justify-center rounded-full bg-{profileColor}-500 leading-100"
                    >
                        <span class="text-20 text-center text-white uppercase font-semibold"
                            >{profileInitial || 'A'}</span
                        >
                    </div>
                    <Text type="h4">John Doe</Text>
                </div>
            {/if}
            <Settings {locale} />
        </div>
    </Drawer>
{:else}
    <aside
        class="flex flex-col justify-center items-center bg-white dark:bg-gray-800 h-screen relative w-20 px-5 pb-9 pt-9 border-solid border-r border-gray-100 dark:border-gray-800"
    >
        <Logo classes="logo mb-9 {hasTitleBar ? 'mt-3' : ''}" width="48px" logo="logo-firefly" />
        <nav class="flex flex-grow flex-col items-center justify-between">
            <div class="flex flex-col">
                <button
                    class="mb-8 {$dashboardRoute === Tabs.Wallet ? 'text-blue-500' : 'text-gray-500'}"
                    on:click={openWallet}
                >
                    <Icon width="24" height="24" icon="wallet" />
                </button>
                <button
                    class="{$dashboardRoute === Tabs.Staking ? 'text-blue-500' : 'text-gray-500'} relative"
                    on:click={openStaking}
                >
                    <Icon width="24" height="24" icon="tokens" />
                    {#if !$activeProfile?.hasVisitedStaking || showStakingNotification}
                        <span class="absolute -top-2 -left-2 flex justify-center items-center h-3 w-3">
                            <span
                                class="animate-ping absolute inline-flex h-full w-full rounded-full {showStakingNotification
                                    ? 'bg-yellow-400'
                                    : 'bg-red-300'} opacity-75"
                            />
                            <span
                                class="relative inline-flex rounded-full h-2 w-2 {showStakingNotification
                                    ? 'bg-yellow-600'
                                    : 'bg-red-500'}"
                            />
                        </span>
                    {/if}
                </button>
            </div>
            <span class="flex flex-col items-center">
                <button class="mb-7 health-status" on:click={() => (showNetwork = true)}>
                    <Icon
                        width="24"
                        height="24"
                        icon="network"
                        classes="text-{NETWORK_HEALTH_COLORS[healthStatus]}-500"
                    />
                </button>
                <button
                    class="w-8 h-8 flex items-center justify-center rounded-full bg-{profileColor}-500 leading-100"
                    on:click={() => (showProfile = true)}
                >
                    <span class="text-12 text-center text-white uppercase">{profileInitial}</span>
                </button>
            </span>
        </nav>
        <NetworkIndicator bind:isActive={showNetwork} {locale} />
        <ProfileActionsModal bind:isActive={showProfile} {locale} />
    </aside>
{/if}

<style type="text/scss">
    :global(body.platform-win32) aside {
        @apply -top-12;
        @apply pt-12;
    }
    .menu-button {
        position: absolute;
        top: calc(env(safe-area-inset-top) * 2.2);
        right: 30px;
    }
    header {
        position: sticky;
        top: 0;
        padding-top: calc(env(safe-area-inset-top) * 2.2);
        z-index: 10;
    }
</style>
