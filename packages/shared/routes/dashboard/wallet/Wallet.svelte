<script lang="typescript">
    import { isDeepLinkRequestActive } from '@common/deep-links'
    import { AccountSummaryAndAssetsPane, AccountActivityPane, LineChartPane, BarChartPane } from 'shared/components'
    import { sendParams } from 'shared/lib/app'
    import { addProfileCurrencyPriceData } from 'shared/lib/market'
    import { openPopup } from 'shared/lib/popup'
    import { hasGeneratedALedgerReceiveAddress } from 'shared/lib/wallet'
    import { onMount } from 'svelte'
    import { activeProfile } from '@core/profile'
    import { isLedgerProfile } from '@core/profile'
    import { selectedAccount, selectedAccountId } from '@core/account'

    const { loggedIn } = $activeProfile

    // TODO: move to dashboard or lib
    $: {
        if ($isDeepLinkRequestActive && $sendParams && $sendParams.address) {
            openPopup({
                type: 'sendForm',
                overflow: true,
            })
            isDeepLinkRequestActive.set(false)
        }
    }

    // TODO: move to lib
    // If account changes force regeneration of Ledger receive address
    $: if ($selectedAccountId && $isLedgerProfile) {
        hasGeneratedALedgerReceiveAddress.set(false)
    }

    // TODO: move to error handling lib
    // function onError(error?: any): void {
    //     if ($isLedgerProfile) {
    //         if (!LedgerErrorType[error.type]) {
    //             displayNotificationForLedgerProfile('error', true, true, false, false, error)
    //         }
    //     } else {
    //         showAppNotification({
    //             type: 'error',
    //             message: localize(error?.error || 'error.global.generic'),
    //         })
    //     }
    // }

    onMount(() => {
        // TODO: change so settings doesn't go back to wallet??
        // If we are in settings when logged out the router reset
        // switches back to the wallet, but there is no longer
        // an active profile, only init if there is a profile
        if ($activeProfile && $loggedIn) {
            // TODO: Remove old api
            // removeEventListeners($activeProfile?.id)

            // initialiseListeners()

            // TODO: Replace with new api when developed and move out of this file
            // if ($isSoftwareProfile) {
            //     api.getStrongholdStatus({
            //         onSuccess(strongholdStatusResponse) {
            //             isStrongholdLocked.set(strongholdStatusResponse.payload.snapshot.status === 'Locked')
            //         },
            //         onError(err) {
            //             console.error(err)
            //         },
            //     })
            // }

            void addProfileCurrencyPriceData()
        }
    })
</script>

{#if $selectedAccount}
    <div class="w-full h-full flex flex-col flex-nowrap p-10 relative flex-1 bg-gray-50 dark:bg-gray-900">
        {#key $selectedAccount?.id}
            <div class="w-full h-full grid grid-cols-3 gap-x-4 min-h-0">
                <AccountSummaryAndAssetsPane />
                <AccountActivityPane />
                <div class=" flex flex-col space-y-4">
                    <LineChartPane />
                    <BarChartPane />
                </div>
            </div>
        {/key}
    </div>
{/if}
