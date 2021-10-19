<script lang="typescript">
    import { Idle, Sidebar } from 'shared/components'
    import { loggedIn, logout, sendParams } from 'shared/lib/app'
    import { appSettings } from 'shared/lib/appSettings'
    import { deepLinkRequestActive, parseDeepLink } from 'shared/lib/deepLinking/deepLinking'
    import { DeepLinkingContexts } from 'shared/lib/typings/deepLinking/deepLinking';
    import { WalletOperations } from 'shared/lib/typings/deepLinking/walletContext';
    import { Electron } from 'shared/lib/electron'
    import { isPollingLedgerDeviceStatus, pollLedgerDeviceStatus, stopPollingLedgerStatus } from 'shared/lib/ledger'
    import { ongoingSnapshot, openSnapshotPopup } from 'shared/lib/migration'
    import {
        NOTIFICATION_TIMEOUT_NEVER,
        removeDisplayNotification,
        showAppNotification,
    } from 'shared/lib/notifications'
    import { closePopup, openPopup, popupState } from 'shared/lib/popup'
    import { activeProfile, isLedgerProfile, isSoftwareProfile, updateProfile } from 'shared/lib/profile'
    import { accountRoute, dashboardRoute, routerNext, settingsChildRoute, settingsRoute, walletRoute } from 'shared/lib/router'
    import type { Locale } from 'shared/lib/typings/i18n'
    import { AccountRoutes, AdvancedSettings, SettingsRoutes, Tabs, WalletRoutes } from 'shared/lib/typings/routes'
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

    export let locale: Locale
    export let mobile

    const { accountsLoaded, accounts } = $wallet

    const tabs = {
        wallet: Wallet,
        settings: Settings,
    }

    let mounted = false
    let startInit
    let busy
    let fundsSoonNotificationId

    const LEDGER_STATUS_POLL_INTERVAL = 2000

    // TODO: add missing unsubscribe to onDestroy
    ongoingSnapshot.subscribe((os) => {
        if (os) {
            openSnapshotPopup()
        }
    })

    const unsubscribeFromAccountsLoaded = accountsLoaded.subscribe(() => {
        if (get(accountsLoaded)) {
            Electron.onEvent('deep-link-params', (data: string) => handleDeepLinkRequest(data))
            Electron.DeepLinkManager.checkDeepLinkRequestExists()
        }
    })

    onMount(() => {
        mounted = true
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

        Electron.onEvent('menu-logout', () => {
            void logout()
        })

        Electron.onEvent('notification-activated', (contextData) => {
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
    })

    onDestroy(() => {
        Electron.DeepLinkManager.clearDeepLinkRequest()
        Electron.removeListenersForEvent('deep-link-params')
        unsubscribeFromAccountsLoaded()

        if (fundsSoonNotificationId) {
            removeDisplayNotification(fundsSoonNotificationId)
        }
        if ($isLedgerProfile) {
            stopPollingLedgerStatus()
        }

        mounted = false
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
            deepLinkRequestActive.set(true)
            if (get(dashboardRoute) !== tab) {
                dashboardRoute.set(tab)
            }
        }
        if (mounted && !$appSettings.deepLinking) {
            _redirect(Tabs.Settings)
            settingsRoute.set(SettingsRoutes.AdvancedSettings)
            settingsChildRoute.set(AdvancedSettings.DeepLinks)
            showAppNotification({ type: 'warning', message: locale('notifications.deepLinkingRequest.notEnabled') })
        } else {
            if (mounted && $accounts && $accounts.length > 0) {
                let addressPrefix = $accounts[0].depositAddress.split('1')[0]
                const parsedDeepLink = parseDeepLink(addressPrefix, data)
                if (
                    parsedDeepLink &&
                    parsedDeepLink.context === DeepLinkingContexts.Wallet &&
                    parsedDeepLink.operation === WalletOperations.Send &&
                    parsedDeepLink.params
                ) {
                    _redirect(Tabs.Wallet)
                    sendParams.set({
                        ...parsedDeepLink.params,
                        isInternal: false,
                    })
                    showAppNotification({ type: parsedDeepLink.notification.type, message: parsedDeepLink.notification.message })
                } else {
                    showAppNotification({ type: 'error', message: locale('notifications.deepLinkingRequest.invalidFormat') })
                }
                Electron.DeepLinkManager.clearDeepLinkRequest()
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
