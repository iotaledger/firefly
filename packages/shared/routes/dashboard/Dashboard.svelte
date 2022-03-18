<script lang="typescript">
    import { onDestroy, onMount } from 'svelte'
    import { get } from 'svelte/store'

    import { Settings, Staking, Wallet } from 'shared/routes'
    import { loggedIn, logout, mobile, sendParams } from 'shared/lib/app'
    import { appSettings, isAwareOfCrashReporting } from 'shared/lib/appSettings'
    import { isPollingLedgerDeviceStatus, pollLedgerDeviceStatus, stopPollingLedgerStatus } from 'shared/lib/ledger'
    import { ongoingSnapshot, openSnapshotPopup } from 'shared/lib/migration'
    import { DeveloperProfileIndicator, Idle, Sidebar } from 'shared/components'
    import { clearPollNetworkInterval, pollNetworkStatus } from 'shared/lib/networkStatus'
    import {
        NOTIFICATION_TIMEOUT_NEVER,
        removeDisplayNotification,
        showAppNotification,
    } from 'shared/lib/notifications'
    import { clearPollParticipationOverviewInterval, pollParticipationOverview } from 'shared/lib/participation'
    import { getParticipationEvents } from 'shared/lib/participation/api'
    import { Platform } from 'shared/lib/platform'
    import { closePopup, openPopup, popupState } from 'shared/lib/popup'
    import { activeProfile, isLedgerProfile, isSoftwareProfile, updateProfile } from 'shared/lib/profile'
    import {
        accountRoute,
        dashboardRoute,
        routerNext,
        settingsChildRoute,
        settingsRoute,
        walletRoute,
    } from 'shared/lib/router'
    import { Locale } from 'shared/lib/typings/i18n'
    import { AccountRoutes, AdvancedSettings, SettingsRoutes, Tabs, WalletRoutes } from 'shared/lib/typings/routes'
    import {
        api,
        isBackgroundSyncing,
        selectedAccountId,
        STRONGHOLD_PASSWORD_CLEAR_INTERVAL_SECS,
        wallet,
    } from 'shared/lib/wallet'
    import { DeepLinkContext, isDeepLinkRequestActive, parseDeepLinkRequest, WalletOperation } from '@common/deep-links'

    export let locale: Locale

    const { accountsLoaded, accounts } = $wallet

    const tabs = {
        wallet: Wallet,
        settings: Settings,
        staking: Staking,
    }

    let startInit
    let busy
    let fundsSoonNotificationId

    const LEDGER_STATUS_POLL_INTERVAL = 2000

    const unsubscribeAccountsLoaded = accountsLoaded.subscribe((val) => {
        if (val) {
            void getParticipationEvents()

            void pollNetworkStatus()
            void pollParticipationOverview()
        } else {
            clearPollNetworkInterval()
            clearPollParticipationOverviewInterval()
        }
    })

    const unsubscribeOngoingSnapshot = ongoingSnapshot.subscribe((os) => {
        if (os) {
            openSnapshotPopup()
        }
    })

    onMount(() => {
        if ($isSoftwareProfile) {
            api.setStrongholdPasswordClearInterval({ secs: STRONGHOLD_PASSWORD_CLEAR_INTERVAL_SECS, nanos: 0 })
        }

        if (!get(isBackgroundSyncing)) {
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
        }

        Platform.onEvent('menu-logout', () => {
            void logout()
        })

        Platform.onEvent('notification-activated', (contextData) => {
            if (contextData) {
                if (
                    (contextData.type === 'confirmed' ||
                        contextData.type === 'failed' ||
                        contextData.type === 'valueTx') &&
                    contextData.accountId
                ) {
                    selectedAccountId.set(contextData.accountId)
                    if (get(dashboardRoute) !== Tabs.Wallet) {
                        dashboardRoute.set(Tabs.Wallet)
                    }
                    walletRoute.set(WalletRoutes.Account)
                    accountRoute.set(AccountRoutes.Init)
                }
            }
        })

        Platform.onEvent('deep-link-params', (data: string) => handleDeepLinkRequest(data))

        /**
         * NOTE: We check for mobile because it's only necessary
         * for existing desktop installation.
         */
        if (!mobile && !$isAwareOfCrashReporting) {
            openPopup({
                type: 'crashReporting',
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
        if ($isLedgerProfile) {
            stopPollingLedgerStatus()
        }
    })

    if ($walletRoute === WalletRoutes.Init && !$accountsLoaded && $loggedIn) {
        startInit = Date.now()
        busy = true
        if (!get(popupState).active) {
            openPopup({
                type: 'busy',
                hideClose: true,
                fullScreen: true,
                transition: false,
            })
        }
    }

    $: {
        if ($accountsLoaded) {
            const minTimeElapsed = 3000 - (Date.now() - startInit)
            const cancelBusyState = () => {
                busy = false
                if (get(popupState).type === 'busy') {
                    closePopup()
                }
                Platform.DeepLinkManager.checkDeepLinkRequestExists()
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

    /**
     * Handles deep link request
     */
    const handleDeepLinkRequest = (data) => {
        const _redirect = (tab) => {
            isDeepLinkRequestActive.set(true)
            if (get(dashboardRoute) !== tab) {
                dashboardRoute.set(tab)
            }
        }
        if (!$appSettings.deepLinking) {
            _redirect(Tabs.Settings)
            settingsRoute.set(SettingsRoutes.AdvancedSettings)
            settingsChildRoute.set(AdvancedSettings.DeepLinks)
            showAppNotification({ type: 'warning', message: locale('notifications.deepLinkingRequest.notEnabled') })
        } else {
            if ($accounts && $accounts.length > 0) {
                const addressPrefix = $accounts[0].depositAddress.split('1')[0]
                const parsedDeepLink = parseDeepLinkRequest(addressPrefix, data)
                if (
                    parsedDeepLink &&
                    parsedDeepLink.context === DeepLinkContext.Wallet &&
                    parsedDeepLink.operation === WalletOperation.Send &&
                    parsedDeepLink.parameters
                ) {
                    _redirect(Tabs.Wallet)
                    sendParams.set({
                        ...parsedDeepLink.parameters,
                        isInternal: false,
                    })
                    showAppNotification({
                        type: parsedDeepLink.notification.type,
                        message: parsedDeepLink.notification.message,
                    })
                } else {
                    showAppNotification({
                        type: 'error',
                        message: locale('notifications.deepLinkingRequest.invalidFormat'),
                    })
                }
                Platform.DeepLinkManager.clearDeepLinkRequest()
            }
        }
    }

    $: if (!busy && $accountsLoaded) {
        /**
         * If the profile has dummy migration transactions,
         * then we open a "funds available soon" notification
         */
        if (get(activeProfile)?.migratedTransactions?.length && !fundsSoonNotificationId) {
            fundsSoonNotificationId = showAppNotification({
                type: 'warning',
                message: locale('notifications.fundsAvailableSoon'),
                progress: undefined,
                timeout: NOTIFICATION_TIMEOUT_NEVER,
                actions: [
                    {
                        label: locale('actions.dismiss'),
                        callback: () => removeDisplayNotification(fundsSoonNotificationId),
                    },
                ],
            })
        }
    }
    $: if ($activeProfile) {
        const shouldDisplayMigrationPopup =
            // Only display popup once the user successfully migrates the first account index
            $isLedgerProfile &&
            $activeProfile.ledgerMigrationCount > 0 &&
            !$activeProfile.hasVisitedDashboard &&
            !$popupState.active
        if (shouldDisplayMigrationPopup) {
            updateProfile('hasVisitedDashboard', true)

            openPopup({
                type: 'ledgerMigrateIndex',
                preventClose: true,
            })
        }
    }

    /**
     * If the user doesnt have any dummy migration transaction
     * but there is an active "funds available soon" notification,
     * then we close it
     */
    $: if ($activeProfile && !$activeProfile?.migratedTransactions?.length && fundsSoonNotificationId) {
        removeDisplayNotification(fundsSoonNotificationId)
        fundsSoonNotificationId = null
    }

    /**
     * Reactive statement to resume ledger poll if it was interrupted
     * when the one which interrupted has finished
     */
    $: if ($activeProfile && $isLedgerProfile && !$isPollingLedgerDeviceStatus) {
        pollLedgerDeviceStatus(false, LEDGER_STATUS_POLL_INTERVAL)
    }
</script>

<Idle />
<div class="dashboard-wrapper flex flex-row w-full h-full">
    <Sidebar {locale} />
    <!-- Dashboard Pane -->
    <div class="flex flex-col w-full h-full">
        <svelte:component this={tabs[$dashboardRoute]} {locale} on:next={routerNext} />
        <DeveloperProfileIndicator {locale} classes="absolute top-0" />
    </div>
</div>

<style type="text/scss">
    :global(:not(body.platform-win32)) .dashboard-wrapper {
        margin-top: calc(env(safe-area-inset-top) / 2);
    }
</style>
