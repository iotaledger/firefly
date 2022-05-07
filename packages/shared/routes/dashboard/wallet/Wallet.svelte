<script lang="typescript">
    import { isDeepLinkRequestActive } from '@common/deep-links'
    import { Pane, AccountSummaryAndAssetsPane, AccountHistoryPane } from 'shared/components'
    import { loggedIn, sendParams } from 'shared/lib/app'
    import { localize } from '@core/i18n'
    import { displayNotificationForLedgerProfile } from 'shared/lib/ledger'
    import { addProfileCurrencyPriceData } from 'shared/lib/market'
    import { showAppNotification } from 'shared/lib/notifications'
    import { openPopup } from 'shared/lib/popup'
    import {
        activeProfile,
        isLedgerProfile,
        isSoftwareProfile,
        isStrongholdLocked,
        setMissingProfileType,
    } from 'shared/lib/profile'
    import { LedgerErrorType } from 'shared/lib/typings/events'
    import {
        api,
        asyncSyncAccounts,
        getSyncAccountOptions,
        hasGeneratedALedgerReceiveAddress,
        isFirstSessionSync,
        removeEventListeners,
        selectedAccount,
        selectedAccountId,
        wallet,
    } from 'shared/lib/wallet'
    import { initialiseListeners } from 'shared/lib/walletApiListeners'
    import { onMount } from 'svelte'

    const { accounts, accountsLoaded } = $wallet

    $: {
        if ($isDeepLinkRequestActive && $sendParams && $sendParams.address) {
            openPopup({
                type: 'sendForm',
                overflow: true,
            })
            isDeepLinkRequestActive.set(false)
        }
    }

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
                <AccountSummaryAndAssetsPane />
                <AccountHistoryPane />
                <div class=" flex flex-col space-y-4">
                    <!-- // TODO: move these into pane components -->
                    <Pane classes="w-full h-1/2">
                        <!-- <LineChart /> -->
                    </Pane>
                    <Pane classes="w-full h-1/2">
                        <!-- <BarChart /> -->
                    </Pane>
                </div>
            </div>
        {/key}
    </div>
{/if}

<style type="text/scss">
    :global(body.platform-win32) .wallet-wrapper {
        @apply pt-0;
    }
</style>
