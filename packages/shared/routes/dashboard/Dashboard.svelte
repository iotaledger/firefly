<script lang="typescript">
    import { Idle, Sidebar } from 'shared/components'
    import { loggedIn, logout } from 'shared/lib/app'
    import { Electron } from 'shared/lib/electron'
    import { isPollingLedgerDeviceStatus, pollLedgerDeviceStatus, stopPollingLedgerStatus } from 'shared/lib/ledger'
    import { ongoingSnapshot, openSnapshotPopup } from 'shared/lib/migration'
    import { NOTIFICATION_TIMEOUT_NEVER, removeDisplayNotification, showAppNotification } from 'shared/lib/notifications'
    import { closePopup, openPopup, popupState } from 'shared/lib/popup'
    import { activeProfile, isLedgerProfile, isSoftwareProfile, updateProfile } from 'shared/lib/profile'
    import { accountRoute, dashboardRoute, routerNext, walletRoute } from 'shared/lib/router'
    import { AccountRoutes, Tabs, WalletRoutes } from 'shared/lib/typings/routes'
    import {
        api,
        isBackgroundSyncing,
        selectedAccountId,
        STRONGHOLD_PASSWORD_CLEAR_INTERVAL_SECS,
        wallet,
    } from 'shared/lib/wallet'
    import { Settings, Wallet } from 'shared/routes'
    import { onDestroy, onMount } from 'svelte'
    import { get } from 'svelte/store'

    export let locale
    export let mobile

    const tabs = {
        wallet: Wallet,
        settings: Settings,
    }

    const { accountsLoaded } = $wallet

    let startInit
    let busy
    let fundsSoonNotificationId

    const LEDGER_STATUS_POLL_INTERVAL = 2000

    ongoingSnapshot.subscribe((os) => {
        if (os) {
            openSnapshotPopup()
        }
    })

    onMount(async () => {
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

        // TODO: Re-enable deep links
        // Electron.DeepLinkManager.requestDeepLink()
        // Electron.onEvent('deep-link-params', (data) => handleDeepLinkRequest(data))

        Electron.onEvent('menu-logout', () => {
            logout()
        })

        Electron.onEvent('notification-activated', (contextData) => {
            if (contextData) {
                if (
                    (contextData.type === 'confirmed' || contextData.type === 'failed' || contextData.type === 'valueTx') &&
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
    })

    onDestroy(() => {
        if (fundsSoonNotificationId) {
            removeDisplayNotification(fundsSoonNotificationId)
        }
        if ($isLedgerProfile) {
            stopPollingLedgerStatus()
        }
    })

    // TODO: re-enable deep links
    // /**
    //  * Handles deep link request
    //  * If deep linking is enabled, fill send input parameters
    //  * If deep linking is disabled, direct user to settings
    //  */
    // const handleDeepLinkRequest = (data) => {
    //     const parsedData = parseDeepLink(data)
    //     const _redirect = (tab) => {
    //         deepLinkRequestActive.set(true)
    //         if (get(dashboardRoute) !== tab) {
    //             dashboardRoute.set(tab)
    //         }
    //     }

    //     if (!$appSettings.deepLinking) {
    //         _redirect(Tabs.Settings)
    //         // TODO: Add alert system
    //         console.log('deep linking not enabled')
    //     } else if (parsedData) {
    //         _redirect(Tabs.Wallet)
    //         sendParams.set(parsedData)
    //     } else {
    //         console.log('error parsing')
    //     }
    // }

    // $: {
    //     if ($deepLinkRequestActive && $appSettings.deepLinking) {
    //         walletRoute.set(WalletRoutes.Send)
    //         deepLinkRequestActive.set(false)
    //     }
    // }

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

{#if mobile}
    <div>foo</div>
{:else}
    <Idle />
    <div class="flex flex-row w-full h-full">
        <Sidebar {locale} />
        <!-- Dashboard Pane -->
        <svelte:component this={tabs[$dashboardRoute]} {locale} on:next={routerNext} />
    </div>
{/if}
