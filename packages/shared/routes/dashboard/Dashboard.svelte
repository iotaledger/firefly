<script lang="typescript">
    import { Idle, Sidebar } from 'shared/components'
    import { loggedIn, logout, sendParams } from 'shared/lib/app'
    import { appSettings } from 'shared/lib/appSettings'
    import { deepLinkRequestActive } from 'shared/lib/deepLinking'
    import { Electron } from 'shared/lib/electron'
    import { chrysalisLive, ongoingSnapshot, openSnapshotPopup, pollChrysalisStatus } from 'shared/lib/migration'
    import { NOTIFICATION_TIMEOUT_NEVER, removeDisplayNotification, showAppNotification } from 'shared/lib/notifications'
    import { closePopup, openPopup } from 'shared/lib/popup'
    import { activeProfile } from 'shared/lib/profile'
    import { showSystemNotification } from 'shared/lib/notifications'
    import { accountRoute, dashboardRoute, routerNext, walletRoute } from 'shared/lib/router'
    import { AccountRoutes, Tabs, WalletRoutes } from 'shared/lib/typings/routes'
    import { parseDeepLink } from 'shared/lib/utils'
    import { api, selectedAccountId, STRONGHOLD_PASSWORD_CLEAR_INTERVAL_SECS, wallet } from 'shared/lib/wallet'
    import { Settings, Wallet } from 'shared/routes'
    import { onDestroy, onMount } from 'svelte'
    import { get } from 'svelte/store'

    const { accountsLoaded, accounts } = $wallet

    export let locale
    export let mobile

    const tabs = {
        wallet: Wallet,
        settings: Settings,
    }

    let startInit
    let chrysalisStatusUnsubscribe
    let busy
    let migrationNotificationId

    ongoingSnapshot.subscribe((os) => {
        if (os) {
            openSnapshotPopup()
        }
    });

    const accountsSubscription = accountsLoaded.subscribe(() => {
        Electron.DeepLinkManager.requestDeepLink()
        Electron.onEvent('deep-link-params', (data) => handleDeepLinkRequest(data))
    })

    onMount(async () => {
        api.setStrongholdPasswordClearInterval({ secs: STRONGHOLD_PASSWORD_CLEAR_INTERVAL_SECS, nanos: 0 })

        Electron.DeepLinkManager.requestDeepLink()
        Electron.onEvent('deep-link-params', (data) => handleDeepLinkRequest(data))

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
        accountsSubscription()
        if (chrysalisStatusUnsubscribe) {
            chrysalisStatusUnsubscribe()
        }
        if (migrationNotificationId) {
            removeDisplayNotification(migrationNotificationId)
        }
    })

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
        if (!$appSettings.deepLinking) {
            _redirect(Tabs.Settings)
            showSystemNotification({ type: 'info', message: locale('notifications.deepLinkingIsNotEnabled') })
        } else {
            if ($accounts && $accounts.length > 0) {
                let addressPrefix = $accounts[0].depositAddress.split('1')[0]

                const parsedData = parseDeepLink(addressPrefix, data)

                if (parsedData && parsedData.context === 'wallet' && parsedData.operation === 'send') {
                    _redirect(Tabs.Wallet)
                    sendParams.set({
                        ...parsedData.params,
                        isInternal: false,
                    })
                } else {
                    showSystemNotification({ type: 'error', message: locale('notifications.deepLinkingInvalidFormat') })
                }
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
