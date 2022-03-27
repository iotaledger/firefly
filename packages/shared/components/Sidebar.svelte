<script lang="typescript">
    import { Logo, Icon, NetworkIndicator, ProfileActionsModal } from 'shared/components'
    import { getInitials } from 'shared/lib/helpers'
    import { networkStatus, NETWORK_HEALTH_COLORS } from 'shared/lib/networkStatus'
    import { isStakingPossible } from 'shared/lib/participation'
    import { partiallyUnstakedAmount, stakingEventState } from 'shared/lib/participation/stores'
    import { activeProfile, getColor } from 'shared/lib/profile'
    import { selectedAccount } from 'shared/lib/wallet'
    import { dashboardRoute, resetWalletRoute, settingsRoute } from 'shared/lib/router'
    import type { SidebarTab as SidebarTabType } from 'shared/lib/typings/routes'
    import { Tabs } from 'shared/lib/typings/routes'
    import { Locale } from 'shared/lib/typings/i18n'

    export let locale: Locale

    let showNetwork = false
    let showProfile = false
    let prevPartiallyUnstakedAmount = 0 // store the previous unstaked funds to avoid notifying when unstaked funds decrease
    let showStakingNotification = false
    const profileColor = 'blue' // TODO: each profile has a different color
    // $: color = getColor($activeProfile, $selectedAccount?.id) as string
    
    const hasTitleBar = document.body.classList.contains('platform-win32')
    
    $: profileInitial = getInitials($activeProfile?.name, 1)
    $: healthStatus = $networkStatus.health ?? 0
    $: $dashboardRoute, $stakingEventState, $partiallyUnstakedAmount, manageUnstakedAmountNotification()

    $: $activeProfile?.hasVisitedStaking, showStakingNotification, updateSidebarNotification()

    let sidebarTabs: SidebarTabType[] = [
        {
            icon: 'wallet',
            label: locale('tabs.wallet'),
            route: Tabs.Wallet,
            onClick: openWallet,
        },
        {
            icon: 'tokens',
            label: locale('tabs.staking'),
            route: Tabs.Staking,
            onClick: openStaking,
        },
    ]

    function updateSidebarNotification() {
        sidebarTabs = sidebarTabs.map((tab) => {
            if (Tabs.Staking === tab.route) {
                tab.notificationType = !$activeProfile?.hasVisitedStaking
                    ? 'warning'
                    : showStakingNotification
                    ? 'error'
                    : null
            }
            return tab
        })
    }

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

    function openStaking() {
        dashboardRoute.set(Tabs.Staking)
    }
</script>

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
                <Icon width="24" height="24" icon="network" classes="text-{NETWORK_HEALTH_COLORS[healthStatus]}-500" />
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

<style type="text/scss">
    :global(body.platform-win32) aside {
        @apply -top-12;
        @apply pt-12;
    }
</style>
