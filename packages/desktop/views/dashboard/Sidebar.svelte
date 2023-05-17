<script lang="ts">
    import { Icon as IconEnum, NETWORK_ICON_SVG } from '@auxiliary/icon'
    import { SidebarTab } from '@components'
    import { appVersionDetails } from '@core/app/stores'
    import { localize } from '@core/i18n'
    import { activeProfile } from '@core/profile/stores'
    import { DashboardRoute, collectiblesRouter, dashboardRouter, governanceRouter, settingsRouter } from '@core/router'
    import { isRecentDate } from '@core/utils'
    import { ISidebarTab } from '@desktop/routers'
    import features from '@features/features'
    import { Icon, Modal, NotificationBadge, ProfileActionsModal, ProfilePicture } from '@ui'

    let profileModal: Modal

    const profileColor = 'blue' // TODO: each profile has a different color

    const { shouldOpenProfileModal } = $activeProfile

    $: lastStrongholdBackupTime = $activeProfile?.lastStrongholdBackupTime
    $: lastBackupDate = lastStrongholdBackupTime ? new Date(lastStrongholdBackupTime) : null
    $: isBackupSafe = lastBackupDate && isRecentDate(lastBackupDate)?.lessThanThreeMonths

    let sidebarTabs: ISidebarTab[]
    $: sidebarTabs = [
        ...(features?.wallet?.enabled
            ? [
                  {
                      icon: IconEnum.Wallet,
                      label: localize('tabs.wallet'),
                      route: DashboardRoute.Wallet,
                      onClick: openWallet,
                  },
              ]
            : []),
        ...(features?.collectibles?.enabled
            ? [
                  {
                      icon: IconEnum.Collectibles,
                      label: localize('tabs.collectibles'),
                      route: DashboardRoute.Collectibles,
                      onClick: openCollectibles,
                  },
              ]
            : []),
        ...(features?.governance?.enabled
            ? [
                  {
                      icon: IconEnum.Governance,
                      label: localize('tabs.governance'),
                      route: DashboardRoute.Governance,
                      onClick: openGovernance,
                  },
              ]
            : []),
        ...(features?.developerTools?.enabled && $activeProfile?.isDeveloperProfile
            ? [
                  {
                      icon: IconEnum.Tools,
                      label: localize('tabs.developer'),
                      route: DashboardRoute.Developer,
                      onClick: openDeveloper,
                  },
              ]
            : []),
    ]

    function openWallet(): void {
        resetAllRouters()
    }

    function openCollectibles(): void {
        resetAllRouters()
        $dashboardRouter.goTo(DashboardRoute.Collectibles)
    }

    function openGovernance(): void {
        resetAllRouters()
        $dashboardRouter.goTo(DashboardRoute.Governance)
    }

    function openDeveloper(): void {
        resetAllRouters()
        $dashboardRouter.goTo(DashboardRoute.Developer)
    }

    function resetAllRouters(): void {
        $dashboardRouter.reset()
        $collectiblesRouter.reset()
        $settingsRouter.reset()
        $governanceRouter.reset()
    }
</script>

<aside
    class="flex flex-col justify-center items-center bg-white dark:bg-gray-800 relative w-18 px-5 pt-10 pb-5 border-solid border-r border-gray-100 dark:border-gray-800"
>
    <nav class="flex flex-grow flex-col items-center justify-between">
        <div class="flex flex-col items-center">
            <Icon
                width="48"
                height="48"
                icon={NETWORK_ICON_SVG[$activeProfile?.network?.id]}
                classes="dark:text-white"
            />
        </div>
        <div class="flex flex-col flex-auto items-center justify-center mb-7 space-y-8">
            {#each sidebarTabs as tab}
                <div class="flex">
                    <SidebarTab {tab} />
                </div>
            {/each}
        </div>
        <div class="flex flex-col items-center">
            <button
                class="w-10 h-10 relative flex items-center justify-center rounded-full bg-{profileColor}-500 leading-100"
                on:click={profileModal?.open}
            >
                <ProfilePicture profile={$activeProfile} size="medium" />
                {#if !$shouldOpenProfileModal && (!isBackupSafe || !$appVersionDetails.upToDate)}
                    <NotificationBadge />
                {/if}
            </button>
        </div>
    </nav>
    <ProfileActionsModal bind:modal={profileModal} />
</aside>

<style type="text/scss">
    :global(body.platform-win32) aside {
        @apply -top-0;
        @apply pt-10;
    }
</style>
