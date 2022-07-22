<script lang="typescript">
    import { handleDeepLink } from '@common/deep-links'
    import { localize } from '@core/i18n'
    import { clearPollNetworkInterval, pollNetworkStatus, nodeInfo } from '@core/network'
    import {
        activeProfile,
        hasStrongholdLocked,
        isLedgerProfile,
        logout,
        reflectLockedStronghold,
        saveActiveProfile,
    } from '@core/profile'
    import { appRouter, dashboardRoute } from '@core/router'
    import { Idle, Sidebar } from 'shared/components'
    import { isPollingLedgerDeviceStatus, stopPollingLedgerStatus } from 'shared/lib/ledger'
    import { ongoingSnapshot } from 'shared/lib/migration'
    import { removeDisplayNotification, showAppNotification } from 'shared/lib/notifications'
    import { Platform } from 'shared/lib/platform'
    import { closePopup, openPopup, popupState } from 'shared/lib/popup'
    import { Settings, Staking, Wallet, DeveloperTools } from 'shared/routes'
    import { onDestroy, onMount } from 'svelte'
    import { get } from 'svelte/store'
    import TopNavigation from './TopNavigation.svelte'

    const { hasLoadedAccounts, loggedIn } = $activeProfile

    $: $activeProfile, saveActiveProfile()

    const tabs = {
        wallet: Wallet,
        settings: Settings,
        staking: Staking,
        developerTools: DeveloperTools,
    }

    let startInit
    let busy
    let fundsSoonNotificationId
    let developerProfileNotificationId
    let showTopNav = false

    // const LEDGER_STATUS_POLL_INTERVAL = 2000

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
        // void getParticipationEvents()
        /* if (shouldVisitStaking()) {
            updateProfile('hasVisitedStaking', false)
            updateProfile('lastAssemblyPeriodVisitedStaking', CURRENT_ASSEMBLY_STAKING_PERIOD)
            updateProfile('lastShimmerPeriodVisitedStaking', CURRENT_SHIMMER_STAKING_PERIOD)
        } */
        /*         if (!get(isBackgroundSyncing)) {
            api.startBackgroundSync(
                {
                    secs: 30,
                    nanos: 0,
                },
                true,
                {
                    onSuccess() {
                        isBackgroundSyncing.set(true)
                    },
                    onError(err) {
                        showAppNotification({
                            type: 'error',
                            message: locale('error.account.syncing'),
                        })
                    },
                }
            )
        } */

        Platform.onEvent('menu-logout', () => {
            void logout()
        })

        Platform.onEvent('deep-link-params', (data: string) => {
            handleDeepLinkRequest(data)
        })

        /* Platform.onEvent('notification-activated', (contextData) => {
            if (contextData) {
                if (
                    (contextData.type === 'confirmed' ||
                        contextData.type === 'failed' ||
                        contextData.type === 'valueTx') &&
                    contextData.accountId
                ) {
                    setSelectedAccount(contextData.accountId)
                    $dashboardRouter.goTo(DashboardRoute.Wallet)
                    $accountRouter.goTo(AccountRoute.Init)
                }
            }
        }) */
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
        if ($isLedgerProfile) {
            stopPollingLedgerStatus()
        }
    })

    $: if (!$hasLoadedAccounts && $loggedIn) {
        startInit = Date.now()
        busy = true
        if (!get(popupState).active) {
            openPopup({
                type: 'busy',
                hideClose: true,
                preventClose: true,
                fullScreen: true,
                transition: false,
            })
        }
    }

    $: {
        if ($hasLoadedAccounts && $loggedIn) {
            const minTimeElapsed = 3000 - (Date.now() - startInit)
            const cancelBusyState = () => {
                busy = false
                if (get(popupState).type === 'busy') {
                    closePopup(true)
                }
                Platform.DeepLinkManager.checkDeepLinkRequestExists()
                showTopNav = true
            }
            if (minTimeElapsed < 0) {
                cancelBusyState()
            } else {
                setTimeout(() => {
                    cancelBusyState()
                }, minTimeElapsed)
            }
        }
    }

    // TODO: handle deep link requests for new send form
    const handleDeepLinkRequest = (data: string): void => {
        if ($activeProfile?.hasLoadedAccounts) {
            handleDeepLink(data)
        }
    }

    $: if (!busy && $hasLoadedAccounts) {
        /**
         * If the profile has dummy migration transactions,
         * then we open a "funds available soon" notification
         */
        // if (get(activeProfile)?.migratedTransactions?.length && !fundsSoonNotificationId) {
        //     fundsSoonNotificationId = showAppNotification({
        //         type: 'warning',
        //         message: locale('notifications.fundsAvailableSoon'),
        //         progress: undefined,
        //         timeout: NOTIFICATION_TIMEOUT_NEVER,
        //         actions: [
        //             {
        //                 label: locale('actions.dismiss'),
        //                 callback: () => removeDisplayNotification(fundsSoonNotificationId),
        //             },
        //         ],
        //     })
        // }
        if ($activeProfile?.isDeveloperProfile && !developerProfileNotificationId) {
            // Show developer profile warning
            developerProfileNotificationId = showAppNotification({
                type: 'warning',
                message: localize('indicators.developerProfileIndicator.warningText', {
                    values: { networkName: $nodeInfo?.protocol?.networkName },
                }),
            })
        }
    }

    // $: if ($activeProfile) {
    //     const shouldDisplayMigrationPopup =
    //         // Only display popup once the user successfully migrates the first account index
    //         $isLedgerProfile &&
    //         $activeProfile?.ledgerMigrationCount > 0 &&
    //         !$activeProfile?.hasVisitedDashboard &&
    //         !$popupState.active
    //     if (shouldDisplayMigrationPopup) {
    //         updateProfile('hasVisitedDashboard', true)

    //         openPopup({
    //             type: 'ledgerMigrateIndex',
    //             preventClose: true,
    //         })
    //     }
    // }

    /**
     * If the user doesnt have any dummy migration transaction
     * but there is an active "funds available soon" notification,
     * then we close it
     */
    // $: if ($activeProfile && !$activeProfile?.migratedTransactions?.length && fundsSoonNotificationId) {
    //     removeDisplayNotification(fundsSoonNotificationId)
    //     fundsSoonNotificationId = null
    // }

    /**
     * Reactive statement to resume ledger poll if it was interrupted
     * when the one which interrupted has finished
     */
    $: if ($activeProfile && $isLedgerProfile && !$isPollingLedgerDeviceStatus) {
        // pollLedgerDeviceStatus(false, LEDGER_STATUS_POLL_INTERVAL)
    }

    $: $hasStrongholdLocked && reflectLockedStronghold()
</script>

<Idle />
<div class="dashboard-wrapper flex flex-col w-full h-full">
    {#if showTopNav}
        <TopNavigation />
    {/if}
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
