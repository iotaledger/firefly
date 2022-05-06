<script lang="typescript">
    import { isDeepLinkRequestActive } from '@common/deep-links'
    import { accountRoute } from '@core/router'
    import { AccountRoute } from '@core/router/enums'
    import { AccountActionsModal, DashboardPane, Text, Modal } from 'shared/components'
    import { loggedIn, sendParams } from 'shared/lib/app'
    import { localize } from '@core/i18n'
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
    import { AccountIdentifier } from 'shared/lib/typings/account'
    import { LedgerErrorType } from 'shared/lib/typings/events'
    import {
        profileManager,
        api,
        asyncSyncAccounts,
        getAccountMessages,
        getStardustAccount,
        getSyncAccountOptions,
        hasGeneratedALedgerReceiveAddress,
        isFirstSessionSync,
        prepareAccountInfo,
        removeEventListeners,
        selectedAccount,
        selectedAccountId,
        updateBalanceOverview,
        wallet,
    } from 'shared/lib/wallet'
    import { initialiseListeners } from 'shared/lib/walletApiListeners'
    import { onMount } from 'svelte'
    import { AccountAssets, AccountBalance, AccountHistory, BarChart, LineChart, ManageAccount, Send } from './views/'

    const { accounts, accountsLoaded, internalTransfersInProgress } = $wallet

    let modal: Modal

    $: {
        if ($isDeepLinkRequestActive && $sendParams && $sendParams.address) {
            openPopup({
                type: 'sendForm',
                overflow: true,
            })
            isDeepLinkRequestActive.set(false)
        }
    }

    let isGeneratingAddress = false

    // If account changes force regeneration of Ledger receive address
    $: if ($selectedAccountId && $isLedgerProfile) {
        hasGeneratedALedgerReceiveAddress.set(false)
    }

    $: if ($accountsLoaded) {
        // update profileType if it is missing
        if (!$activeProfile?.type) {
            setMissingProfileType($accounts)
        }
    }

    async function _continue(): Promise<void> {
        $accountsLoaded = true
        const { gapLimit, accountDiscoveryThreshold } = getSyncAccountOptions()

        try {
            await asyncSyncAccounts(0, gapLimit, accountDiscoveryThreshold, false)
            if ($isFirstSessionSync) {
                $isFirstSessionSync = false
            }
        } catch (err) {
            onError(err)
        }
    }

    function onError(error?: any): void {
        if ($isLedgerProfile) {
            if (!LedgerErrorType[error.type]) {
                displayNotificationForLedgerProfile('error', true, true, false, false, error)
            }
        } else {
            showAppNotification({
                type: 'error',
                message: localize(error?.error || 'error.global.generic'),
            })
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
                onError(err) {
                    console.error(err)
                },
            })
        } else {
            promptUserToConnectLedger(false, () => _generate(), undefined)
        }
    }

    onMount(() => {
        // If we are in settings when logged out the router reset
        // switches back to the wallet, but there is no longer
        // an active profile, only init if there is a profile
        if ($activeProfile && $loggedIn) {
            removeEventListeners($activeProfile.id)

            initialiseListeners()

            if ($isSoftwareProfile) {
                api.getStrongholdStatus({
                    onSuccess(strongholdStatusResponse) {
                        isStrongholdLocked.set(strongholdStatusResponse.payload.snapshot.status === 'Locked')
                    },
                    onError(err) {
                        console.error(err)
                    },
                })
            }

            void addProfileCurrencyPriceData()
        }
    })
</script>

{#if $selectedAccount}
    <div class="w-full h-full flex flex-col flex-nowrap p-10 relative flex-1 bg-gray-50 dark:bg-gray-900">
        {#key $selectedAccount?.id}
            <div class="w-full h-full grid grid-cols-3 gap-x-4 min-h-0">
                <DashboardPane classes=" h-full flex flex-auto flex-col flex-shrink-0">
                    {#if $accountRoute !== AccountRoute.Manage}
                        <AccountBalance onMenuClick={modal?.toggle} />
                    {/if}
                    <DashboardPane classes="h-full {$accountRoute !== AccountRoute.Manage ? '-mt-5' : ''} z-0">
                        {#if $activeProfile?.hiddenAccounts?.includes($selectedAccount?.id)}
                            <div class="px-6 my-4">
                                <Text type="p" secondary>{localize('general.accountRemoved')}</Text>
                            </div>
                        {/if}
                        {#if $accountRoute === AccountRoute.Init}
                            <AccountAssets />
                        {:else if $accountRoute === AccountRoute.Manage}
                            <ManageAccount alias={$selectedAccount.alias()} account={$selectedAccount} />
                        {/if}
                    </DashboardPane>
                </DashboardPane>
                <DashboardPane>
                    <!-- <AccountHistory transactions={getAccountMessages($selectedAccount)} /> -->
                </DashboardPane>
                <div class=" flex flex-col space-y-4">
                    <DashboardPane classes="w-full h-1/2">
                        <!-- <LineChart /> -->
                    </DashboardPane>
                    <DashboardPane classes="w-full h-1/2">
                        <!-- <BarChart /> -->
                    </DashboardPane>
                </div>
            </div>
            <AccountActionsModal bind:modal />
        {/key}
    </div>
{/if}

<style type="text/scss">
    :global(body.platform-win32) .wallet-wrapper {
        @apply pt-0;
    }
</style>
