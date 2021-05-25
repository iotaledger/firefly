<script lang="typescript">
    import { Idle, Sidebar } from 'shared/components'
    import { loggedIn, logout, sendParams } from 'shared/lib/app'
    import { appSettings } from 'shared/lib/appSettings'
    import { deepLinkRequestActive } from 'shared/lib/deepLinking'
    import { Electron } from 'shared/lib/electron'
    import { chrysalisLive, ongoingSnapshot, openSnapshotPopup, pollChrysalisStatus } from 'shared/lib/migration'
    import { NOTIFICATION_TIMEOUT_NEVER, removeDisplayNotification, showAppNotification } from 'shared/lib/notifications'
    import { closePopup, openPopup } from 'shared/lib/popup'
    import { activeProfile, isSoftwareProfile } from 'shared/lib/profile'
    import { accountRoute, dashboardRoute, routerNext, walletRoute } from 'shared/lib/router'
    import { AccountRoutes, Tabs, WalletRoutes } from 'shared/lib/typings/routes'
    import { parseDeepLink } from 'shared/lib/utils'
    import { api, selectedAccountId, STRONGHOLD_PASSWORD_CLEAR_INTERVAL_SECS, wallet } from 'shared/lib/wallet'
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
    let chrysalisStatusUnsubscribe
    let busy
    let migrationNotificationId

    ongoingSnapshot.subscribe((os) => {
        if (os) {
            openSnapshotPopup()
        }
    })

    onMount(async () => {
        if ($isSoftwareProfile) {
            api.setStrongholdPasswordClearInterval({ secs: STRONGHOLD_PASSWORD_CLEAR_INTERVAL_SECS, nanos: 0 })
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

        if ($activeProfile?.migratedTransactions?.length) {
            await pollChrysalisStatus()
        }
    })

    onDestroy(() => {
        if (chrysalisStatusUnsubscribe) {
            chrysalisStatusUnsubscribe()
        }
        if (migrationNotificationId) {
            removeDisplayNotification(migrationNotificationId)
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
        openPopup({
            type: 'busy',
            hideClose: true,
            fullScreen: true,
            transition: false,
        })
    }
    $: {
        if ($accountsLoaded) {
            const minTimeElapsed = 3000 - (Date.now() - startInit)
            if (minTimeElapsed < 0) {
                busy = false
                closePopup()
            } else {
                setTimeout(() => {
                    busy = false
                    closePopup()
                }, minTimeElapsed)
            }
        }
    }

    $: if (!busy && $accountsLoaded) {
        if (get(activeProfile)?.migratedTransactions?.length) {
            handleChrysalisStatusNotifications()
        }
    }
    $: if ($activeProfile) {
        if (!get(activeProfile)?.migratedTransactions?.length && migrationNotificationId) {
            removeDisplayNotification(migrationNotificationId)
            migrationNotificationId = null
            if (chrysalisStatusUnsubscribe) {
                chrysalisStatusUnsubscribe()
                chrysalisStatusUnsubscribe = null
            }
        }
    }

    function handleChrysalisStatusNotifications() {
        chrysalisStatusUnsubscribe = chrysalisLive.subscribe((live) => {
            if (typeof live === 'boolean' && live === false) {
                removeDisplayNotification(migrationNotificationId) // clean first otherwise it shows up while whatching
                migrationNotificationId = null
                if (get(activeProfile)?.migratedTransactions?.length) {
                    migrationNotificationId = showAppNotification({
                        type: 'warning',
                        message: locale('notifications.migratedAccountChrysalisDown'),
                        progress: undefined,
                        timeout: NOTIFICATION_TIMEOUT_NEVER,
                        actions: [
                            {
                                label: locale('actions.viewStatus'),
                                isPrimary: true,
                                callback: () => Electron.openUrl('https://chrysalis.iota.org'),
                            },
                            {
                                label: locale('actions.dismiss'),
                                callback: () => removeDisplayNotification(migrationNotificationId),
                            },
                        ],
                    })
                }
            } else if (typeof live === 'boolean' && live === true) {
                removeDisplayNotification(migrationNotificationId)
                migrationNotificationId = null
                if ($activeProfile?.migratedTransactions?.length) {
                    migrationNotificationId = showAppNotification({
                        type: 'warning',
                        message: locale('notifications.migratedAccountChrysalisUp'),
                        progress: undefined,
                        timeout: NOTIFICATION_TIMEOUT_NEVER,
                        actions: [
                            {
                                label: locale('actions.viewStatus'),
                                isPrimary: true,
                                callback: () => Electron.openUrl('https://chrysalis.iota.org'),
                            },
                            {
                                label: locale('actions.dismiss'),
                                callback: () => removeDisplayNotification(migrationNotificationId),
                            },
                        ],
                    })
                }
            }
        })
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
