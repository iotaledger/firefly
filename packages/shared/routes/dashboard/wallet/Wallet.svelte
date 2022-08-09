<script lang="typescript">
    import { isDeepLinkRequestActive } from '@common/deep-links'
    import { localize } from '@core/i18n'
    import { accountRoute, accountRouter, backButtonStore, walletRoute } from '@core/router'
    import { AccountRoute, WalletRoute } from '@core/router/enums'
    import { asyncGetAccounts, setSelectedAccount } from '@lib/wallet'
    import {
        AccountActionsModal,
        ActivityDetail,
        BottomNavigation,
        DashboardPane,
        Drawer,
        Modal,
        Text,
    } from 'shared/components'
    import {
        AccountActions,
        AddressHistory,
        DeleteAccount,
        ExportTransactionHistory,
        HideAccount,
    } from 'shared/components/drawerContent'
    import { mobileHeaderAnimation, touchInterpolation } from 'shared/lib/animation'
    import { clearSendParams, loggedIn, mobile, sendParams } from 'shared/lib/app'
    import { deepCopy } from 'shared/lib/helpers'
    import { displayNotificationForLedgerProfile, promptUserToConnectLedger } from 'shared/lib/ledger'
    import { addProfileCurrencyPriceData } from 'shared/lib/market'
    import { showAppNotification } from 'shared/lib/notifications'
    import { closePopup, openPopup } from 'shared/lib/popup'
    import {
        activeProfile,
        isLedgerProfile,
        isSoftwareProfile,
        isStrongholdLocked,
        setMissingProfileType,
    } from 'shared/lib/profile'
    import { checkStronghold } from 'shared/lib/stronghold'
    import { AccountIdentifier } from 'shared/lib/typings/account'
    import { LedgerErrorType, TransferProgressEventType } from 'shared/lib/typings/events'
    import { Message, Transaction } from 'shared/lib/typings/message'
    import { WalletAccount } from 'shared/lib/typings/wallet'
    import {
        accountSyncingQueueStore,
        api,
        asyncSyncAccounts,
        getAccountMessages,
        getAccountSyncOptions,
        hasGeneratedALedgerReceiveAddress,
        initializeAccountSyncingQueue,
        isBackgroundSyncing,
        isFirstSessionSync,
        isInitialAccountSync,
        isTransferring,
        processAccountSyncingQueue,
        processLoadedAccounts,
        removeEventListeners,
        selectedAccountIdStore,
        selectedAccountStore,
        transferState,
        selectedMessage,
        wallet,
        haveStakingResultsCached,
    } from 'shared/lib/wallet'
    import { initialiseListeners } from 'shared/lib/walletApiListeners'
    import { getContext, onDestroy, onMount } from 'svelte'
    import { spring } from 'svelte/motion'
    import { get, Readable } from 'svelte/store'
    import { fade } from 'svelte/transition'
    import {
        AccountAssets,
        AccountBalance,
        AccountHistory,
        BarChart,
        LineChart,
        ManageAccount,
        Receive,
        Send,
    } from './views/'

    const { accounts, accountsLoaded, internalTransfersInProgress } = $wallet
    const headerScale = spring(1)
    const headerScaleOptions = {
        spring: headerScale,
        upperBoundary: 1,
        lowerBoundary: 0,
        intensityScale: 2,
        upDownThreshold: 0.5,
        active: true,
    }

    const unsubscribeHeaderScale = headerScale.subscribe((curr) => mobileHeaderAnimation.set(curr))

    let unsubscribeLiftDasboard = () => {}
    let unsubscribeScrollDetection = () => {}

    const viewableAccounts = getContext<Readable<WalletAccount[]>>('viewableAccounts')

    let modal: Modal

    $: {
        if ($isDeepLinkRequestActive && $sendParams && $sendParams.address) {
            $accountRouter.goTo(AccountRoute.Send)
            isDeepLinkRequestActive.set(false)
        }
    }

    let isGeneratingAddress = false

    let drawer: Drawer
    let activityDrawer: Drawer

    let headerHeight = 0
    let scroll = false
    let bottomNavigation: BottomNavigation

    // If account changes force regeneration of Ledger receive address
    $: if ($selectedAccountIdStore && $isLedgerProfile) {
        hasGeneratedALedgerReceiveAddress.set(false)
    }

    $: if ($accountsLoaded) {
        // update profileType if it is missing
        if (!$activeProfile?.type) {
            setMissingProfileType($accounts)
        }
    }

    $: accountSyncingQueueLength = $accountSyncingQueueStore?.length || 0
    $: if (accountSyncingQueueLength > 0) {
        void processAccountSyncingQueue()
    } else {
        if ($isFirstSessionSync && $accountSyncingQueueStore !== null) {
            isFirstSessionSync.set(false)
        }
    }

    async function loadAccounts(): Promise<void> {
        try {
            const loadedAccounts = await asyncGetAccounts()
            await processLoadedAccounts(loadedAccounts)
            setSelectedAccount($activeProfile.lastUsedAccountId ?? $viewableAccounts?.[0]?.id ?? null)
            accountsLoaded.set(true)
            const { gapLimit, accountDiscoveryThreshold } = getAccountSyncOptions()

            if (isInitialAccountSync()) {
                await asyncSyncAccounts(0, gapLimit, accountDiscoveryThreshold, false)
                isFirstSessionSync.set(false)
            } else {
                initializeAccountSyncingQueue()
            }
            if (!get(isBackgroundSyncing)) {
                api.startBackgroundSync(
                    {
                        secs: 30,
                        nanos: 0,
                    },
                    true,
                    gapLimit,
                    {
                        onSuccess() {
                            isBackgroundSyncing.set(true)
                        },
                        onError(err) {
                            showAppNotification({
                                type: 'error',
                                message: localize('error.account.syncing'),
                            })
                        },
                    }
                )
            }
        } catch (err) {
            if ($isLedgerProfile) {
                if (!LedgerErrorType[err.type]) {
                    displayNotificationForLedgerProfile('error', true, true, false, false, err)
                }
            } else {
                showAppNotification({
                    type: 'error',
                    message: localize(err?.error || 'error.global.generic'),
                })
            }
        }
    }

    function onGenerateAddress(accountId: AccountIdentifier) {
        const _generate = () => {
            isGeneratingAddress = true

            if ($isLedgerProfile) displayNotificationForLedgerProfile('error', true, true)

            api.getUnusedAddress(accountId.toString(), {
                onSuccess(response) {
                    accounts.update((accounts) =>
                        accounts.map((account) => {
                            if (account.id === accountId) {
                                account.depositAddress = response.payload.address

                                if (!account.addresses.some((a) => a.address === response.payload.address)) {
                                    account.addresses.push(response.payload)
                                }
                            }

                            return account
                        })
                    )
                    closePopup(true)

                    isGeneratingAddress = false
                    hasGeneratedALedgerReceiveAddress.set(true)
                },
                onError(err) {
                    closePopup(true)

                    console.error(err)

                    isGeneratingAddress = false

                    const isClientError = err && err.type === 'ClientError'
                    const shouldHideErrorNotification =
                        isClientError && err.error === 'error.node.chrysalisNodeInactive'
                    if (!shouldHideErrorNotification) {
                        /**
                         * NOTE: To ensure a clear error message (for Ledger users),
                         * we need to update the locale path.
                         */
                        const localePath =
                            isClientError && $isLedgerProfile ? 'error.ledger.generateAddress' : err.error
                        showAppNotification({
                            type: 'error',
                            message: localize(localePath),
                        })
                    }
                },
            })
        }

        if ($isSoftwareProfile) {
            api.getStrongholdStatus({
                onSuccess(strongholdStatusResponse) {
                    if (strongholdStatusResponse.payload.snapshot.status === 'Locked') {
                        openPopup({ type: 'password', props: { onSuccess: _generate } })
                    } else {
                        _generate()
                    }
                },
                onError(error) {
                    console.error(error)
                },
            })
        } else {
            promptUserToConnectLedger(false, () => _generate(), undefined)
        }
    }

    function onSend(senderAccountId, receiveAddress, amount) {
        const _send = () => {
            isTransferring.set(true)
            api.send(
                senderAccountId,
                {
                    amount,
                    address: receiveAddress,
                    remainder_value_strategy: {
                        strategy: 'ChangeAddress',
                    },
                    indexation: { index: 'firefly', data: [] },
                },
                {
                    onSuccess(response) {
                        accounts.update((_accounts) =>
                            _accounts.map((_account) => {
                                if (_account.id === senderAccountId) {
                                    return Object.assign<WalletAccount, WalletAccount, Partial<WalletAccount>>(
                                        {} as WalletAccount,
                                        _account,
                                        {
                                            messages: [response.payload, ..._account.messages],
                                        }
                                    )
                                }

                                return _account
                            })
                        )

                        transferState.set({
                            type: TransferProgressEventType.Complete,
                        })

                        if ($mobile) {
                            walletRoute.set(WalletRoute.AccountHistory)
                            accountRoute.set(AccountRoute.Init)
                        }

                        setTimeout(() => {
                            clearSendParams()
                            isTransferring.set(false)
                        }, 3000)
                    },
                    onError(err) {
                        isTransferring.set(false)
                        if ($mobile) {
                            walletRoute.set(WalletRoute.AccountHistory)
                            accountRoute.set(AccountRoute.Init)
                        }
                        showAppNotification({
                            type: 'error',
                            message: localize(err.error),
                        })
                    },
                }
            )
        }

        if ($isSoftwareProfile) {
            checkStronghold(_send)
        } else {
            _send()
        }
    }

    function onInternalTransfer(senderAccountId, receiverAccountId, amount, internal) {
        const _internalTransfer = () => {
            isTransferring.set(true)
            api.internalTransfer(senderAccountId, receiverAccountId, amount, {
                onSuccess(response) {
                    const message = response.payload

                    internalTransfersInProgress.update((transfers) => {
                        transfers[message.id] = {
                            from: senderAccountId,
                            to: receiverAccountId,
                        }

                        return transfers
                    })

                    accounts.update((_accounts) =>
                        _accounts.map((_account) => {
                            if (_account.id === senderAccountId) {
                                const m = deepCopy(message) as Message
                                const mPayload = m.payload as Transaction
                                mPayload.data.essence.data.incoming = false
                                mPayload.data.essence.data.internal = true
                                _account.messages.push(m)
                            }
                            if (_account.id === receiverAccountId) {
                                const m = deepCopy(message) as Message
                                const mPayload = m.payload as Transaction
                                mPayload.data.essence.data.incoming = true
                                mPayload.data.essence.data.internal = true
                                _account.messages.push(m)
                            }

                            return _account
                        })
                    )

                    transferState.set({
                        type: TransferProgressEventType.Complete,
                    })

                    if ($mobile) {
                        walletRoute.set(WalletRoute.AccountHistory)
                        accountRoute.set(AccountRoute.Init)
                    }

                    setTimeout(() => {
                        clearSendParams(internal)
                        isTransferring.set(false)
                    }, 3000)
                },
                onError(err) {
                    isTransferring.set(false)
                    if ($mobile) {
                        accountRoute.set(AccountRoute.Init)
                    }
                    showAppNotification({
                        type: 'error',
                        message: localize(err.error),
                    })
                },
            })
        }

        if ($isSoftwareProfile) {
            api.getStrongholdStatus({
                onSuccess(strongholdStatusResponse) {
                    if (strongholdStatusResponse.payload.snapshot.status === 'Locked') {
                        openPopup({ type: 'password', props: { onSuccess: _internalTransfer } })
                    } else {
                        _internalTransfer()
                    }
                },
                onError(error) {
                    console.error(error)
                },
            })
        } else {
            _internalTransfer()
        }
    }

    $: if (mobile && drawer && $accountRoute !== AccountRoute.Init) {
        drawer.open()
    }

    $: if (mobile && drawer && $accountRoute === AccountRoute.Init) {
        drawer.close()
        if (drawer.isDrawerOpen() === false) {
            $backButtonStore.reset()
        }
    }

    onMount(() => {
        $backButtonStore.reset()

        // If we are in settings when logged out the router reset
        // switches back to the wallet, but there is no longer
        // an active profile, only init if there is a profile
        if ($activeProfile && $loggedIn) {
            if (!$accountsLoaded) {
                void loadAccounts()
            }

            removeEventListeners($activeProfile.id)

            initialiseListeners()

            if ($isSoftwareProfile) {
                api.getStrongholdStatus({
                    onSuccess(strongholdStatusResponse) {
                        isStrongholdLocked.set(strongholdStatusResponse.payload.snapshot.status === 'Locked')
                    },
                    onError(error) {
                        console.error(error)
                    },
                })
            }

            void addProfileCurrencyPriceData()
        }
    })

    const handleMenuClick = () => $accountRouter.goTo(AccountRoute.Actions)

    function setHeaderHeight(node: HTMLElement): void {
        headerHeight = node.clientHeight
    }

    function liftDashboard(node: HTMLElement): void {
        node.style.zIndex = '0'
        unsubscribeLiftDasboard = headerScale.subscribe((curr) => {
            node.style.transform = `translate(0, ${headerHeight * 0.6 * curr + headerHeight * 0.4}px)`
        })
    }

    function scrollDetection(node: HTMLElement): void {
        unsubscribeScrollDetection = headerScale.subscribe((curr) => {
            if (curr <= 0 && node.scrollTop <= 0) {
                scroll = true
                return
            }
            scroll = false
        })
        node.addEventListener('touchstart', () => {
            if (node.scrollTop > 0) {
                headerScaleOptions.active = false
                return
            }
            if (node.scrollTop <= 0) {
                headerScaleOptions.active = true
            }
        })
    }

    function handleActivityDrawerBackClick(): void {
        selectedMessage.set(null)
    }

    $: if ($selectedMessage && activityDrawer) {
        $backButtonStore.add(activityDrawer.close)
    }

    onDestroy(() => {
        unsubscribeHeaderScale()
        unsubscribeLiftDasboard()
        unsubscribeScrollDetection()
    })
</script>

{#if $selectedAccountStore}
    {#if $mobile}
        <div class="wallet-wrapper w-full h-full flex flex-col bg-gray-50 dark:bg-gray-900 overflow-hidden">
            <div class="flex flex-auto flex-col">
                <!-- Total Balance, Accounts list & Send/Receive -->
                <div class="absolute flex w-full" use:setHeaderHeight>
                    <AccountBalance classes="w-full" onMenuClick={handleMenuClick} scale={headerScale} />
                    <Drawer
                        opened={$accountRoute !== AccountRoute.Init}
                        bind:this={drawer}
                        on:close={() => accountRoute.set(AccountRoute.Init)}
                        backgroundBlur={$accountRoute === AccountRoute.Receive}
                    >
                        {#if $accountRoute === AccountRoute.Send}
                            <Send {onSend} {onInternalTransfer} />
                        {:else if $accountRoute === AccountRoute.Receive}
                            <Receive {isGeneratingAddress} {onGenerateAddress} />
                        {:else if $accountRoute === AccountRoute.Actions}
                            <AccountActions />
                        {:else if $accountRoute === AccountRoute.Manage}
                            <ManageAccount account={$selectedAccountStore} />
                        {:else if $accountRoute === AccountRoute.AddressHistory}
                            <AddressHistory account={$selectedAccountStore} />
                        {:else if $accountRoute === AccountRoute.ExportTransactionHistory}
                            <ExportTransactionHistory account={$selectedAccountStore} />
                        {:else if $accountRoute === AccountRoute.HideAccount}
                            <HideAccount account={$selectedAccountStore} />
                        {:else if $accountRoute === AccountRoute.DeleteAccount}
                            <DeleteAccount account={$selectedAccountStore} />
                        {/if}
                    </Drawer>
                </div>
                <div
                    class="flex flex-1"
                    style="will-change: transform"
                    use:touchInterpolation={headerScaleOptions}
                    use:liftDashboard
                >
                    <DashboardPane classes="w-full">
                        {#if $walletRoute === WalletRoute.Assets}
                            <div class="h-full" in:fade|local={{ duration: 200 }} out:fade|local={{ duration: 200 }}>
                                {#key $haveStakingResultsCached}
                                    <AccountAssets
                                        {scroll}
                                        {scrollDetection}
                                        bottomOffset="{bottomNavigation?.getHeight()}px"
                                    />
                                {/key}
                            </div>
                        {:else if $walletRoute === WalletRoute.AccountHistory}
                            <div class="h-full" in:fade|local={{ duration: 200 }} out:fade|local={{ duration: 200 }}>
                                <AccountHistory
                                    {scroll}
                                    {scrollDetection}
                                    transactions={getAccountMessages($selectedAccountStore)}
                                    bottomOffset="{bottomNavigation?.getHeight() * 0.8}px"
                                />
                            </div>
                        {/if}
                    </DashboardPane>
                </div>
                <BottomNavigation locale={localize} bind:this={bottomNavigation} />
                {#if $selectedMessage}
                    <Drawer opened bind:this={activityDrawer} on:close={handleActivityDrawerBackClick}>
                        <div class="overflow-y-auto h-2/3 space-y-2.5">
                            <ActivityDetail {...$selectedMessage} />
                        </div>
                    </Drawer>
                {/if}
            </div>
        </div>
    {:else}
        <div class="w-full h-full flex flex-col flex-nowrap p-10 relative flex-1 bg-gray-50 dark:bg-gray-900">
            {#key $selectedAccountStore?.id}
                <div class="w-full h-full grid grid-cols-3 gap-x-4 min-h-0">
                    <DashboardPane classes=" h-full flex flex-auto flex-col flex-shrink-0">
                        {#if $accountRoute !== AccountRoute.Manage}
                            <AccountBalance onMenuClick={modal?.toggle} />
                        {/if}
                        <DashboardPane classes="h-full {$accountRoute !== AccountRoute.Manage ? '-mt-5' : ''} z-0">
                            {#if $activeProfile?.hiddenAccounts?.includes($selectedAccountStore?.id)}
                                <div class="px-6 my-4">
                                    <Text type="p" secondary>{localize('general.accountRemoved')}</Text>
                                </div>
                            {/if}
                            {#if $accountRoute === AccountRoute.Init}
                                {#key $haveStakingResultsCached}
                                    <AccountAssets />
                                {/key}
                            {:else if $accountRoute === AccountRoute.Send}
                                <Send {onSend} {onInternalTransfer} />
                            {:else if $accountRoute === AccountRoute.Receive}
                                <Receive {isGeneratingAddress} {onGenerateAddress} />
                            {:else if $accountRoute === AccountRoute.Manage}
                                <ManageAccount account={$selectedAccountStore} />
                            {/if}
                        </DashboardPane>
                    </DashboardPane>
                    <DashboardPane>
                        <AccountHistory transactions={getAccountMessages($selectedAccountStore)} />
                    </DashboardPane>
                    <div class=" flex flex-col space-y-4">
                        <DashboardPane classes="w-full h-1/2">
                            <LineChart />
                        </DashboardPane>
                        <DashboardPane classes="w-full h-1/2">
                            <BarChart />
                        </DashboardPane>
                    </div>
                </div>
                <AccountActionsModal bind:modal />
            {/key}
        </div>
    {/if}
{/if}

<style type="text/scss">
    :global(body.platform-win32) .wallet-wrapper {
        @apply pt-0;
    }
</style>
