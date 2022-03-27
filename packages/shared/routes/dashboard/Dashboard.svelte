<script lang="typescript">
    import { DeepLinkContext, isDeepLinkRequestActive, parseDeepLinkRequest, WalletOperation } from '@common/deep-links'
    import { DeveloperProfileIndicator, Idle, MainMenu, Sidebar } from 'shared/components'
    import { loggedIn, logout, mobile, sendParams } from 'shared/lib/app'
    import { appSettings, isAwareOfCrashReporting } from 'shared/lib/appSettings'
    import { isPollingLedgerDeviceStatus, pollLedgerDeviceStatus, stopPollingLedgerStatus } from 'shared/lib/ledger'
    import { ongoingSnapshot, openSnapshotPopup } from 'shared/lib/migration'
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
    import { accountRoute, dashboardRoute, routerNext, settingsChildRoute, settingsRoute } from 'shared/lib/router'
    import { Locale } from 'shared/lib/typings/i18n'
    import { AccountRoutes, AdvancedSettings, SettingsRoutes, Tabs } from 'shared/lib/typings/routes'
    import { WalletAccount } from 'shared/lib/typings/wallet'
    import {
        api,
        asyncCreateAccount,
        asyncSyncAccountOffline,
        isBackgroundSyncing,
        setSelectedAccount,
        STRONGHOLD_PASSWORD_CLEAR_INTERVAL_SECS,
        wallet,
    } from 'shared/lib/wallet'
    import { Settings, Staking, Wallet } from 'shared/routes'
    import { onDestroy, onMount, setContext } from 'svelte'
    import { derived, get, Readable } from 'svelte/store'
    import TopNavigation from './TopNavigation.svelte'

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

    const viewableAccounts: Readable<WalletAccount[]> = derived(
        [activeProfile, accounts],
        ([$activeProfile, $accounts]) => {
            if (!$activeProfile) {
                return []
            }

            if ($activeProfile.settings.showHiddenAccounts) {
                const sortedAccounts = $accounts.sort((a, b) => a.index - b.index)

                // If the last account is "hidden" and has no value, messages or history treat it as "deleted"
                // This account will get re-used if someone creates a new one
                if (sortedAccounts.length > 1 && $activeProfile.hiddenAccounts) {
                    const lastAccount = sortedAccounts[sortedAccounts.length - 1]
                    if (
                        $activeProfile.hiddenAccounts.includes(lastAccount.id) &&
                        lastAccount.rawIotaBalance === 0 &&
                        lastAccount.messages.length === 0
                    ) {
                        sortedAccounts.pop()
                    }
                }

                return sortedAccounts
            }

            return $accounts
                .filter((a) => !$activeProfile.hiddenAccounts?.includes(a.id))
                .sort((a, b) => a.index - b.index)
        }
    )

    const liveAccounts: Readable<WalletAccount[]> = derived(
        [activeProfile, accounts],
        ([$activeProfile, $accounts]) => {
            if (!$activeProfile) {
                return []
            }
            return $accounts
                .filter((a) => !$activeProfile.hiddenAccounts?.includes(a.id))
                .sort((a, b) => a.index - b.index)
        }
    )

    // TODO: move these stores to lib when we fix the circular imports issue
    setContext<Readable<WalletAccount[]>>('viewableAccounts', viewableAccounts)
    setContext<Readable<WalletAccount[]>>('liveAccounts', liveAccounts)

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
                    setSelectedAccount(contextData.accountId)
                    if (get(dashboardRoute) !== Tabs.Wallet) {
                        dashboardRoute.set(Tabs.Wallet)
                    }
                    accountRoute.set(AccountRoutes.Init)
                }
            }
        })

        Platform.onEvent('deep-link-params', (data: string) => handleDeepLinkRequest(data))

        /**
         * NOTE: We check for mobile because it's only necessary
         * for existing desktop installation.
         */
        if (!$mobile && !$isAwareOfCrashReporting) {
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

    if (!$accountsLoaded && $loggedIn) {
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

    async function onAccountCreation(alias: string, color: string, onComplete) {
        const _create = async (): Promise<unknown> => {
            try {
                const account = await asyncCreateAccount(alias, color)
                await asyncSyncAccountOffline(account)

                // TODO: set selected account to the newly created account
                accountRoute.set(AccountRoutes.Init)

                return onComplete()
            } catch (err) {
                return onComplete(err)
            }
        }

        if ($isSoftwareProfile) {
            api.getStrongholdStatus({
                onSuccess(strongholdStatusResponse) {
                    if (strongholdStatusResponse.payload.snapshot.status === 'Locked') {
                        openPopup({ type: 'password', props: { onSuccess: _create } })
                    } else {
                        void _create()
                    }
                },
                onError(error) {
                    console.error(error)
                },
            })
        } else {
            await _create()
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

    $: if ($accountsLoaded) {
        // TODO: persist last selected account
        setSelectedAccount(get(viewableAccounts)?.[0]?.id ?? null)
    }
</script>

{#if $mobile}
    <Idle />
    <div class="flex flex-col w-full h-full">
        <TopNavigation {onAccountCreation} />
        <MainMenu {locale} />
        <!-- Dashboard Pane -->
        <svelte:component this={tabs[$dashboardRoute]} {locale} on:next={routerNext} />
    </div>
{:else}
    <Idle />
    <div class="dashboard-wrapper flex flex-row w-full h-full">
        <Sidebar {locale} />
        <!-- Dashboard Pane -->
        <div class="flex flex-col w-full h-full">
            <svelte:component this={tabs[$dashboardRoute]} {locale} on:next={routerNext} />
            <DeveloperProfileIndicator {locale} classes="absolute top-0" />
        </div>
    </div>
{/if}

<style type="text/scss">
    :global(:not(body.platform-win32)) .dashboard-wrapper {
        margin-top: calc(env(safe-area-inset-top) / 2);
    }
</style>
