<script lang="ts">
    import { handleDeepLink } from '@auxiliary/deep-link'
    import { localize } from '@core/i18n'
    import { nodeInfo, NetworkId } from '@core/network'
    import {
        activeProfile,
        hasStrongholdLocked,
        isActiveLedgerProfile,
        logout,
        reflectLockedStronghold,
    } from '@core/profile'
    import { appRouter, dashboardRoute } from '@core/router'
    import { Idle, Link } from 'shared/components'
    import { stopPollingLedgerNanoStatus } from '@core/ledger'
    import { removeDisplayNotification, showAppNotification } from '@auxiliary/notification'
    import { Platform, openUrlInBrowser } from '@core/app'
    import { Developer, Settings, Vesting, Collectibles, Governance, Wallet } from './'
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
        selectedAccountNfts,
    } from '@core/nfts'
    import { selectedAccountIndex } from '@core/account'
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
    }

    let fundsSoonNotificationId
    let developerProfileNotificationId

    $: $hasStrongholdLocked && reflectLockedStronghold()
    $: $nftDownloadQueue, downloadNextNftInQueue()
    $: $downloadingNftId && interruptNftDownloadAfterTimeout(get(selectedAccountIndex))
    $: addSelectedAccountNftsToDownloadQueue($selectedAccountIndex)

    $: if (features.analytics.dashboardRoute.enabled && $dashboardRoute)
        Platform.trackEvent('dashboard-route', { route: $dashboardRoute })

    function addSelectedAccountNftsToDownloadQueue(accountIndex: number): void {
        resetNftDownloadQueue()
        void addNftsToDownloadQueue(accountIndex, $selectedAccountNfts)
    }

    function handleDeepLinkRequest(data: string): void {
        if ($activeProfile?.hasLoadedAccounts) {
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

        if ($activeProfile?.isDeveloperProfile && !developerProfileNotificationId && $nodeInfo) {
            // Show developer profile warning
            developerProfileNotificationId = showAppNotification({
                type: 'warning',
                message: localize('indicators.developerProfileIndicator.warningText', {
                    values: { networkName: $nodeInfo.protocol.networkName },
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
    {#if $activeProfile?.network?.id !== NetworkId.Shimmer || $activeProfile?.network?.id !== NetworkId.ShimmerTestnet}
        <div
            class=" bg-blue-100 dark:bg-gray-800 flex flex-row gap-1 items-center justify-center py-2 font-400 text-13 leading-160 text-center"
        >
            <span class=" text-gray-800 dark:text-white max-w-lg"
                >Please switch to the new IOTA Wallet for continued support and updates.
            </span>
            <Link
                on:click={() =>
                    openUrlInBrowser(
                        'https://chromewebstore.google.com/detail/iota-wallet/iidjkmdceolghepehaaddojmnjnkkija'
                    )}
            >
                Download here
            </Link>
        </div>
    {/if}
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
