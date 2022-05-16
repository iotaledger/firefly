<script lang="typescript">
    import { Icon, NetworkIndicator, ProfileActionsModal, SidebarTab, Modal, PingingBadge } from 'shared/components'
    import { mobile } from 'shared/lib/app'
    import { getInitials, isRecentDate } from 'shared/lib/helpers'
    import { networkStatus, NETWORK_HEALTH_COLORS } from 'shared/lib/networkStatus'
    import { isStakingPossible } from 'shared/lib/participation'
    import {
        assemblyStakingEventState,
        partiallyUnstakedAmount,
        shimmerStakingEventState,
    } from 'shared/lib/participation/stores'
    import { activeProfile, hasEverOpenedProfileModal } from 'shared/lib/profile'
    import {
        dashboardRoute,
        dashboardRouter,
        DashboardRoute,
        resetWalletRoute,
        SidebarTab as SidebarTabType,
    } from '@core/router'
    import { Locale } from '@core/i18n'
    import { versionDetails } from '@lib/appUpdater'

    export let locale: Locale

    let networkModal: Modal
    let profileModal: Modal
    let prevPartiallyUnstakedAmount = 0 // store the previous unstaked funds to avoid notifying when unstaked funds decrease
    let showStakingNotification = false

    const profileColor = 'blue' // TODO: each profile has a different color

    $: profileInitial = getInitials($activeProfile?.name, 1)
    $: healthStatus = $networkStatus.health ?? 0
    $: $dashboardRoute,
        $assemblyStakingEventState,
        $shimmerStakingEventState,
        $partiallyUnstakedAmount,
        manageUnstakedAmountNotification()

    $: $activeProfile?.hasVisitedStaking, showStakingNotification, updateSidebarNotification()
    $: lastStrongholdBackupTime = $activeProfile?.lastStrongholdBackupTime
    $: lastBackupDate = lastStrongholdBackupTime ? new Date(lastStrongholdBackupTime) : null
    $: isBackupSafe = lastBackupDate && isRecentDate(lastBackupDate)?.lessThanThreeMonths

    let sidebarTabs: SidebarTabType[] = [
        {
            icon: 'wallet',
            label: locale('tabs.wallet'),
            route: DashboardRoute.Wallet,
            onClick: openWallet,
        },
        {
            icon: 'tokens',
            label: locale('tabs.staking'),
            route: DashboardRoute.Staking,
            onClick: openStaking,
        },
    ]

    function updateSidebarNotification() {
        sidebarTabs = sidebarTabs.map((tab) => {
            if (DashboardRoute.Staking === tab.route) {
                tab.notificationType = !$activeProfile?.hasVisitedStaking
                    ? 'error'
                    : showStakingNotification
                    ? 'warning'
                    : null
            }
            return tab
        })
    }

    function manageUnstakedAmountNotification() {
        if (isStakingPossible($assemblyStakingEventState) || isStakingPossible($shimmerStakingEventState)) {
            if ($dashboardRoute !== DashboardRoute.Staking && $partiallyUnstakedAmount > prevPartiallyUnstakedAmount) {
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
        $dashboardRouter.goTo(DashboardRoute.Staking)
    }
</script>

<aside
    class="flex flex-col justify-center items-center bg-white dark:bg-gray-800 relative w-20 px-5 pb-5 pt-10 border-solid border-r border-gray-100 dark:border-gray-800"
>
    <nav class="flex flex-grow flex-col items-center justify-between">
        <div class="flex flex-col space-y-8">
            {#each sidebarTabs as tab}
                <div class="flex">
                    <SidebarTab {tab} />
                </div>
            {/each}
        </div>
        <span class="flex flex-col items-center">
            <button class="mb-7 health-status" on:click={networkModal?.open}>
                <Icon width="24" height="24" icon="network" classes="text-{NETWORK_HEALTH_COLORS[healthStatus]}-500" />
            </button>
            <button
                class="w-8 h-8 relative flex items-center justify-center rounded-full bg-{profileColor}-500 leading-100"
                on:click={profileModal?.open}
            >
                <span class="text-12 text-center text-white uppercase">{profileInitial}</span>
                {#if !$hasEverOpenedProfileModal && (!isBackupSafe || !$versionDetails.upToDate)}
                    <PingingBadge innerColor="red-500" outerColor="red-500" />
                {/if}
            </button>
        </span>
    </nav>
    <NetworkIndicator bind:modal={networkModal} {locale} />
    <ProfileActionsModal bind:modal={profileModal} {locale} />
</aside>

<style type="text/scss">
    :global(body.platform-win32) aside {
        @apply -top-0;
        @apply pt-10;
    }
</style>
