<script lang="typescript">
    import {
        dashboardRoute,
        DashboardRoute,
        dashboardRouter,
        governanceRouter,
        resetWalletRoute,
        SidebarTab as SidebarTabType,
    } from '@core/router'
    import { versionDetails } from '@lib/appUpdater'
    import {
        Icon,
        Modal,
        PingingBadge,
        NetworkIndicatorModal,
        ProfileActionsModal,
        SidebarTab,
    } from 'shared/components'
    import { getInitials, isRecentDate } from 'shared/lib/helpers'
    import { networkStatus, NETWORK_HEALTH_COLORS } from 'shared/lib/networkStatus'
    import {
        currentAccountTreasuryVotePartiallyUnvotedAmount,
        isParticipationPossible,
        partiallyUnstakedAmount,
    } from 'shared/lib/participation/account'
    import {
        assemblyStakingEventState,
        shimmerStakingEventState,
        treasuryEventState,
    } from 'shared/lib/participation/stores'
    import { activeProfile, hasEverOpenedProfileModal } from 'shared/lib/profile'
    import { selectedAccountIdStore } from 'shared/lib/wallet'

    let networkModal: Modal
    let profileModal: Modal
    let prevPartiallyUnstakedAmount = 0 // store the previous unstaked funds to avoid notifying when unstaked funds decrease
    let showStakingNotification = false
    let prevCurrentAccountTreasuryVotePartiallyUnvotedAmount = 0 // store the previous unstaked funds to avoid notifying when unstaked funds decrease
    let showGovernanceNotification = false

    const profileColor = 'blue' // TODO: each profile has a different color

    $: profileInitial = getInitials($activeProfile?.name, 1)
    $: healthStatus = $networkStatus.health ?? 0

    // reset previously tracked amounts on wallet change
    $: if ($selectedAccountIdStore) {
        prevCurrentAccountTreasuryVotePartiallyUnvotedAmount = 0
        prevPartiallyUnstakedAmount = 0
        showStakingNotification = false
        showGovernanceNotification = false
        manageUnstakedAmountNotification()
        managePartialVoteNotification()
    }
    $: $dashboardRoute,
        $assemblyStakingEventState,
        $shimmerStakingEventState,
        $partiallyUnstakedAmount,
        manageUnstakedAmountNotification()
    $: $dashboardRoute,
        $treasuryEventState,
        $currentAccountTreasuryVotePartiallyUnvotedAmount,
        managePartialVoteNotification()

    $: $activeProfile?.hasVisitedStaking,
        showStakingNotification,
        showGovernanceNotification,
        updateSidebarNotification()
    $: lastStrongholdBackupTime = $activeProfile?.lastStrongholdBackupTime
    $: lastBackupDate = lastStrongholdBackupTime ? new Date(lastStrongholdBackupTime) : null
    $: isBackupSafe = lastBackupDate && isRecentDate(lastBackupDate)?.lessThanThreeMonths

    let sidebarTabs: SidebarTabType[] = [
        {
            icon: 'wallet',
            label: 'wallet',
            route: DashboardRoute.Wallet,
            onClick: openWallet,
        },
        {
            icon: 'tokens',
            label: 'staking',
            route: DashboardRoute.Staking,
            onClick: openStaking,
        },
        {
            icon: 'voting',
            label: 'governance',
            route: DashboardRoute.Governance,
            onClick: openGovernance,
        },
    ]

    function updateSidebarNotification() {
        sidebarTabs = sidebarTabs.map((tab) => {
            switch (tab.route) {
                case DashboardRoute.Governance:
                    tab.notificationType = showGovernanceNotification ? 'warning' : null
                    break
            }
            return tab
        })
    }

    function manageUnstakedAmountNotification() {
        if (isParticipationPossible($assemblyStakingEventState) || isParticipationPossible($shimmerStakingEventState)) {
            if ($dashboardRoute === DashboardRoute.Staking || !$partiallyUnstakedAmount) {
                showStakingNotification = false
            } else if ($partiallyUnstakedAmount > prevPartiallyUnstakedAmount) {
                showStakingNotification = true
            }
            prevPartiallyUnstakedAmount = $partiallyUnstakedAmount
        } else {
            showStakingNotification = false
        }
    }

    function managePartialVoteNotification() {
        if (isParticipationPossible($treasuryEventState)) {
            if ($dashboardRoute === DashboardRoute.Governance || !$currentAccountTreasuryVotePartiallyUnvotedAmount) {
                showGovernanceNotification = false
            } else if (
                $currentAccountTreasuryVotePartiallyUnvotedAmount > prevCurrentAccountTreasuryVotePartiallyUnvotedAmount
            ) {
                showGovernanceNotification = true
            }
            prevCurrentAccountTreasuryVotePartiallyUnvotedAmount = $currentAccountTreasuryVotePartiallyUnvotedAmount
        } else {
            showGovernanceNotification = false
        }
    }

    function openWallet() {
        resetWalletRoute()
    }

    function openStaking() {
        $dashboardRouter.goTo(DashboardRoute.Staking)
    }

    function openGovernance() {
        // reset router only if you are already on governance, act like a home button
        if ($dashboardRoute === DashboardRoute.Governance) {
            $governanceRouter.reset()
        }
        $dashboardRouter.goTo(DashboardRoute.Governance)
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
    <NetworkIndicatorModal bind:modal={networkModal} />
    <ProfileActionsModal bind:modal={profileModal} />
</aside>

<style type="text/scss">
    :global(body.platform-win32) aside {
        @apply -top-0;
        @apply pt-10;
    }
</style>
