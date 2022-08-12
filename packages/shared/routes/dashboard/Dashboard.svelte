<script lang="typescript">
    import { DeepLinkContext, isDeepLinkRequestActive, parseDeepLinkRequest, WalletOperation } from '@common/deep-links'
    import { Locale } from '@core/i18n'
    import {
        AccountRoute,
        accountRouter,
        AdvancedSettings,
        appRouter,
        dashboardRoute,
        DashboardRoute,
        dashboardRouter,
        SettingsRoute,
        settingsRouter,
    } from '@core/router'
    import {
        CURRENT_ASSEMBLY_STAKING_PERIOD,
        CURRENT_SHIMMER_STAKING_PERIOD,
        LAST_ASSEMBLY_STAKING_PERIOD,
        LAST_SHIMMER_STAKING_PERIOD,
    } from '@lib/participation/constants'
    import { activeProfile, isLedgerProfile, isSoftwareProfile, updateProfile } from '@lib/profile'
    import { Idle, MainMenu, Sidebar, Refresher } from 'shared/components'
    import { loggedIn, logout, mobile, sendParams } from 'shared/lib/app'
    import { appSettings } from 'shared/lib/appSettings'
    import { isPollingLedgerDeviceStatus, pollLedgerDeviceStatus, stopPollingLedgerStatus } from 'shared/lib/ledger'
    import { ongoingSnapshot, openSnapshotPopup } from 'shared/lib/migration'
    import { stopNetworkPoll, pollNetworkStatus } from 'shared/lib/networkStatus'
    import {
        NOTIFICATION_TIMEOUT_NEVER,
        removeDisplayNotification,
        showAppNotification,
    } from 'shared/lib/notifications'
    import { stopParticipationPoll, startParticipationPoll, StakingAirdrop } from 'shared/lib/participation'
    import { cacheAllStakingPeriods } from 'shared/lib/participation/staking'
    import { pendingParticipations, resetPerformingParticipation } from 'shared/lib/participation/stores'
    import { Platform } from 'shared/lib/platform'
    import { closePopup, openPopup, popupState } from 'shared/lib/popup'
    import { WalletAccount } from 'shared/lib/typings/wallet'
    import {
        api,
        asyncCreateAccount,
        asyncSyncAccount,
        isSyncing,
        isFirstSessionSync,
        setSelectedAccount,
        STRONGHOLD_PASSWORD_CLEAR_INTERVAL_SECS,
        wallet,
        selectedAccountStore,
        haveStakingResultsCached,
    } from 'shared/lib/wallet'
    import { Governance, Settings, Staking, Wallet } from 'shared/routes'
    import { onDestroy, onMount, setContext } from 'svelte'
    import { derived, get, Readable } from 'svelte/store'
    import TopNavigation from './TopNavigation.svelte'

    export let locale: Locale

    const { accountsLoaded, accounts } = $wallet

    const tabs = {
        wallet: Wallet,
        settings: Settings,
        staking: Staking,
        governance: Governance,
    }

    let startInit
    let busy
    let fundsSoonNotificationId
    let developerProfileNotificationId
    let showTopNav = false
    let os
    const LEDGER_STATUS_POLL_INTERVAL = 2000

    const unsubscribeAccountsLoaded = accountsLoaded.subscribe((val) => {
        if (val) {
            void pollNetworkStatus()
            void startParticipationPoll()
        }
    })

    const unsubscribeOngoingSnapshot = ongoingSnapshot.subscribe((os) => {
        if (os) {
            openSnapshotPopup()
        }
    })

    let previousPendingParticipationsLength = 0
    const unsubscribePendingParticipations = pendingParticipations.subscribe((participations) => {
        if (participations?.length < previousPendingParticipationsLength && participations?.length === 0) {
            resetPerformingParticipation()
        }
        previousPendingParticipationsLength = participations?.length ?? 0
    })

    $: if (!$isSyncing && !$isFirstSessionSync && $accountsLoaded) {
        Promise.all([
            cacheAllStakingPeriods(StakingAirdrop.Shimmer),
            cacheAllStakingPeriods(StakingAirdrop.Assembly),
        ]).then(() => {
            haveStakingResultsCached.set(true)
        })
    }

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

    function shouldVisitStaking(): boolean {
        if (($activeProfile.lastAssemblyPeriodVisitedStaking ?? 0) < LAST_ASSEMBLY_STAKING_PERIOD) {
            updateProfile('lastAssemblyPeriodVisitedStaking', LAST_ASSEMBLY_STAKING_PERIOD)
        }
        if (($activeProfile.lastShimmerPeriodVisitedStaking ?? 0) < LAST_SHIMMER_STAKING_PERIOD) {
            updateProfile('lastShimmerPeriodVisitedStaking', LAST_SHIMMER_STAKING_PERIOD)
        }
        return (
            CURRENT_ASSEMBLY_STAKING_PERIOD > $activeProfile.lastAssemblyPeriodVisitedStaking ||
            CURRENT_SHIMMER_STAKING_PERIOD > $activeProfile.lastShimmerPeriodVisitedStaking
        )
    }

    onMount(async () => {
        if (shouldVisitStaking()) {
            updateProfile('hasVisitedStaking', false)
            updateProfile('lastAssemblyPeriodVisitedStaking', CURRENT_ASSEMBLY_STAKING_PERIOD)
            updateProfile('lastShimmerPeriodVisitedStaking', CURRENT_SHIMMER_STAKING_PERIOD)
        }

        if ($isSoftwareProfile) {
            api.setStrongholdPasswordClearInterval({ secs: STRONGHOLD_PASSWORD_CLEAR_INTERVAL_SECS, nanos: 0 })
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
                    $dashboardRouter.goTo(DashboardRoute.Wallet)
                    $accountRouter.goTo(AccountRoute.Init)
                }
            }
        })

        Platform.onEvent('deep-link-params', (data: string) => handleDeepLinkRequest(data))

        os = await Platform.getOS()
    })

    onDestroy(() => {
        unsubscribeAccountsLoaded()
        unsubscribeOngoingSnapshot()
        unsubscribePendingParticipations()
        stopNetworkPoll()
        stopParticipationPoll()

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

    const handleDeepLinkRequest = (data: string): void => {
        const _redirect = (tab: DashboardRoute): void => {
            isDeepLinkRequestActive.set(true)
            $dashboardRouter.goTo(tab)
        }
        if (!$appSettings.deepLinking) {
            _redirect(DashboardRoute.Settings)
            $settingsRouter.goToChildRoute(SettingsRoute.AdvancedSettings, AdvancedSettings.DeepLinks)
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
                    _redirect(DashboardRoute.Wallet)
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

    async function onCreateAccount(alias: string, color: string, onComplete) {
        const _create = async (): Promise<unknown> => {
            try {
                const account = await asyncCreateAccount(alias, color)
                await asyncSyncAccount(account)

                setSelectedAccount(account?.id)
                $accountRouter.reset()

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
        if ($activeProfile?.isDeveloperProfile && !developerProfileNotificationId && !$mobile) {
            // Show developer profile warning
            developerProfileNotificationId = showAppNotification({
                type: 'warning',
                message: locale('indicators.developerProfileIndicator.warningText', {
                    values: { networkName: $activeProfile?.settings?.networkConfig.network.name },
                }),
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

    $: showSingleAccountGuide = !$activeProfile?.hasFinishedSingleAccountGuide
    $: if (!busy && $accountsLoaded && showSingleAccountGuide) {
        openPopup({ type: 'singleAccountGuide', hideClose: true, overflow: true })
    }
</script>

{#if $mobile}
    <Idle />
    <div class="flex flex-col w-full h-full bg-white dark:bg-gray-800">
        <MainMenu />
        {#if $mobile}
            <Refresher callback={() => asyncSyncAccount($selectedAccountStore)} platform={os} />
        {/if}
        <TopNavigation {onCreateAccount} />
        <!-- Dashboard Pane -->
        <svelte:component this={tabs[$dashboardRoute]} {locale} on:next={$appRouter.next} />
    </div>
{:else}
    <Idle />
    <div class="dashboard-wrapper flex flex-col w-full h-full">
        {#if showTopNav}
            <TopNavigation
                {onCreateAccount}
                classes={$popupState?.type === 'singleAccountGuide' && $popupState?.active ? 'z-50' : ''}
            />
        {/if}
        <div class="flex flex-row flex-auto h-1">
            <Sidebar />
            <!-- Dashboard Pane -->
            <div class="flex flex-col w-full h-full">
                <svelte:component this={tabs[$dashboardRoute]} {locale} on:next={$appRouter.next} />
            </div>
        </div>
    </div>
{/if}
