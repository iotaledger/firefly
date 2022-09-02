<script lang="typescript">
    import { handleDeepLink } from '@auxiliary/deep-link'
    import { localize } from '@core/i18n'
    import { clearPollNetworkInterval, nodeInfo, pollNetworkStatus } from '@core/network'
    import {
        activeProfile,
        hasStrongholdLocked,
        isActiveLedgerProfile,
        logout,
        reflectLockedStronghold,
        saveActiveProfile,
    } from '@core/profile'
    import { appRouter, dashboardRoute } from '@core/router'
    import { Idle, Sidebar } from 'shared/components'
    import { isPollingLedgerDeviceStatus, stopPollingLedgerStatus, pollLedgerDeviceStatus } from '@core/ledger'
    import { ongoingSnapshot } from 'shared/lib/migration'
    import { removeDisplayNotification, showAppNotification } from 'shared/lib/notifications'
    import { Platform } from 'shared/lib/platform'
    import { Developer, Settings, Staking, Wallet } from 'shared/routes'
    import { onDestroy, onMount } from 'svelte'
    import TopNavigation from './TopNavigation.svelte'

    const { hasLoadedAccounts } = $activeProfile

    $: $activeProfile, saveActiveProfile()

    const tabs = {
        wallet: Wallet,
        settings: Settings,
        staking: Staking,
        developer: Developer,
    }

    let fundsSoonNotificationId
    let developerProfileNotificationId

    const unsubscribeAccountsLoaded = hasLoadedAccounts.subscribe((val) => {
        if (val) {
            void pollNetworkStatus()
            // void pollParticipationOverview()
        } else {
            clearPollNetworkInterval()
            // clearPollParticipationOverviewInterval()
        }
    })

    const unsubscribeOngoingSnapshot = ongoingSnapshot.subscribe((os) => {
        if (os) {
            // openSnapshotPopup()
        }
    })

    /* $: {
        if (!$isSyncing && $isFirstSessionSync && $hasLoadedAccounts) {
            void updateStakingPeriodCache()
        }
    } */

    onMount(() => {
        Platform.onEvent('menu-logout', () => {
            void logout()
        })

        Platform.onEvent('deep-link-params', (data: string) => {
            handleDeepLinkRequest(data)
        })

        Platform.DeepLinkManager.checkDeepLinkRequestExists()

        if ($activeProfile?.isDeveloperProfile && !developerProfileNotificationId) {
            // Show developer profile warning
            developerProfileNotificationId = showAppNotification({
                type: 'warning',
                message: localize('indicators.developerProfileIndicator.warningText', {
                    values: { networkName: $nodeInfo?.protocol?.networkName },
                }),
            })
        }
    })

    onDestroy(() => {
        unsubscribeAccountsLoaded()
        unsubscribeOngoingSnapshot()

        Platform.DeepLinkManager.clearDeepLinkRequest()
        Platform.removeListenersForEvent('deep-link-params')

        if (fundsSoonNotificationId) {
            removeDisplayNotification(fundsSoonNotificationId)
        }
        if (developerProfileNotificationId) {
            removeDisplayNotification(developerProfileNotificationId)
        }
        if ($isActiveLedgerProfile) {
            stopPollingLedgerStatus()
        }
    })

    // TODO: handle deep link requests for new send form
    const handleDeepLinkRequest = (data: string): void => {
        if ($activeProfile?.hasLoadedAccounts) {
            handleDeepLink(data)
        }
    }

    /**
     * Reactive statement to resume ledger poll if it was interrupted
     * when the one which interrupted has finished
     */
    $: if ($activeProfile && $isActiveLedgerProfile && !$isPollingLedgerDeviceStatus) {
        pollLedgerDeviceStatus()
    }

    $: $hasStrongholdLocked && reflectLockedStronghold()
</script>

<Idle />
<div class="dashboard-wrapper flex flex-col w-full h-full">
    <TopNavigation />
    <div class="flex flex-row flex-auto h-1">
        <Sidebar />
        <!-- Dashboard Pane -->
        <div class="flex flex-col w-full h-full">
            <svelte:component this={tabs[$dashboardRoute]} locale={localize} on:next={$appRouter.next} />
        </div>
    </div>
</div>

<style type="text/scss">
    :global(:not(body.platform-win32)) .dashboard-wrapper {
        margin-top: calc(env(safe-area-inset-top) / 2);
    }
</style>
