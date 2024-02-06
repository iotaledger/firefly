<script lang="ts">
    import { handleDeepLink } from '@auxiliary/deep-link'
    import { localize } from '@core/i18n'
    import { NetworkId, nodeInfoNetworkName } from '@core/network'
    import {
        activeProfile,
        hasStrongholdLocked,
        isActiveLedgerProfile,
        logout,
        reflectLockedStronghold,
    } from '@core/profile'
    import { appRouter, dashboardRoute } from '@core/router'
    import { Idle } from 'shared/components'
    import { stopPollingLedgerNanoStatus } from '@core/ledger'
    import { removeDisplayNotification, showAppNotification } from '@auxiliary/notification'
    import { Platform } from '@core/app'
    import { Developer, Settings, Vesting, Collectibles, Governance, Wallet, AccountManagement } from './'
    import { onDestroy, onMount } from 'svelte'
    import Sidebar from './Sidebar.svelte'
    import TopNavigation from './TopNavigation.svelte'

    import {
        addNftsToDownloadQueue,
        downloadingNftId,
        downloadNextNftInQueue,
        interruptNftDownloadAfterTimeout,
        nftDownloadQueue,
        resetNftDownloadQueue,
        selectedWalletNfts,
    } from '@core/nfts'
    import { selectedWalletId } from '@core/wallet'
    import { get } from 'svelte/store'
    import features from '@features/features'
    import { isAwareOfMetricSystemDrop } from '@contexts/dashboard/stores'
    import { openPopup, PopupId } from '@auxiliary/popup'
    import { showBalanceOverviewPopup } from '@contexts/dashboard/stores'

    const tabs = {
        wallet: Wallet,
        settings: Settings,
        collectibles: Collectibles,
        governance: Governance,
        developer: Developer,
        vesting: Vesting,
        accountManagement: AccountManagement,
    }

    let fundsSoonNotificationId
    let developerProfileNotificationId

    $: $hasStrongholdLocked && reflectLockedStronghold()
    $: $nftDownloadQueue, downloadNextNftInQueue()
    $: $downloadingNftId && interruptNftDownloadAfterTimeout(get(selectedWalletId))
    $: addselectedWalletNftsToDownloadQueue($selectedWalletId)

    $: if (features.analytics.dashboardRoute.enabled && $dashboardRoute)
        Platform.trackEvent('dashboard-route', { route: $dashboardRoute })

    function addselectedWalletNftsToDownloadQueue(walletId: string): void {
        resetNftDownloadQueue()
        void addNftsToDownloadQueue(walletId, $selectedWalletNfts)
    }

    function handleDeepLinkRequest(data: string): void {
        if ($activeProfile?.hasLoadedWallets) {
            handleDeepLink(data)
        }
    }

    function handleShouldShowBalanceOverview(): void {
        if ($showBalanceOverviewPopup) {
            openPopup({
                id: PopupId.BalanceFinder,
                props: {
                    title: localize('popups.balanceOverview.title'),
                    body: localize('popups.balanceOverview.body'),
                    showConsolidation: true,
                },
            })
            $showBalanceOverviewPopup = false
        }
    }

    onMount(() => {
        Platform.onEvent('menu-logout', () => {
            void logout()
        })

        Platform.onEvent('deep-link-params', (data: string) => {
            handleDeepLinkRequest(data)
        })

        Platform.onEvent('power-monitor-lock-screen', () => {
            logout()
        })
        Platform.onEvent('power-monitor-suspend', () => {
            logout()
        })

        Platform.DeepLinkManager.checkDeepLinkRequestExists()

        if ($activeProfile?.isDeveloperProfile && !developerProfileNotificationId && $nodeInfoNetworkName) {
            // Show developer profile warning
            developerProfileNotificationId = showAppNotification({
                type: 'warning',
                message: localize('indicators.developerProfileIndicator.warningText', {
                    values: { networkName: $nodeInfoNetworkName },
                }),
            })
        }

        if (!$isAwareOfMetricSystemDrop && $activeProfile?.network?.id === NetworkId.Iota) {
            openPopup({
                id: PopupId.MetricSystemInfo,
                props: {
                    onCancelled: () => {
                        handleShouldShowBalanceOverview()
                    },
                },
            })
            $isAwareOfMetricSystemDrop = true
        } else {
            handleShouldShowBalanceOverview()
        }
    })

    onDestroy(() => {
        Platform.DeepLinkManager.clearDeepLinkRequest()
        Platform.removeListenersForEvent('deep-link-params')

        if (fundsSoonNotificationId) {
            removeDisplayNotification(fundsSoonNotificationId)
        }
        if (developerProfileNotificationId) {
            removeDisplayNotification(developerProfileNotificationId)
        }
        if ($isActiveLedgerProfile) {
            stopPollingLedgerNanoStatus()
        }
    })
</script>

<Idle />
<div class="dashboard-wrapper flex flex-col w-full h-full">
    <TopNavigation />
    <div class="flex flex-row flex-auto h-1">
        <Sidebar />
        <!-- Dashboard Pane -->
        <div class="flex flex-col h-full dashboard-w">
            <svelte:component this={tabs[$dashboardRoute]} on:next={$appRouter.next} />
        </div>
    </div>
</div>

<style lang="scss">
    :global(:not(body.platform-win32)) .dashboard-wrapper {
        margin-top: calc(env(safe-area-inset-top) / 2);
    }

    .dashboard-w {
        --sidebar-width: 4.5rem;
        width: calc(100vw - var(--sidebar-width));
    }
</style>
