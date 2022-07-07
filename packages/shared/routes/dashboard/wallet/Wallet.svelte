<script lang="typescript">
    import { selectedAccount, selectedAccountId } from '@core/account'
    import { activeProfile, isLedgerProfile } from '@core/profile'
    import features from '@features/features'
    import { AccountActivity, AccountAssetsList, AccountSummary, Pane, ReceiveAddressSection } from 'shared/components'
    import { addProfileCurrencyPriceData } from 'shared/lib/market'
    import { hasGeneratedALedgerReceiveAddress } from 'shared/lib/wallet'
    import { onMount } from 'svelte'

    const { loggedIn } = $activeProfile

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
    <div class="w-full h-full flex flex-col flex-nowrap p-8 relative flex-1 bg-gray-50 dark:bg-gray-900">
        {#key $selectedAccount?.id}
            <div class="w-full h-full grid grid-cols-3 gap-x-4 min-h-0">
                <div class="flex flex-col space-y-4">
                    <Pane overflow="visible" classes="flex-none">
                        {#if features?.wallet?.accountSummary?.enabled}
                            <AccountSummary />
                        {/if}
                    </Pane>
                    <Pane classes="h-full p-6">
                        {#if features?.wallet?.sendAndReceive?.enabled}
                            <ReceiveAddressSection addressFontSize="sm" />
                        {/if}
                    </Pane>
                </div>
                <Pane classes="h-full">
                    {#if features?.wallet?.assets?.enabled}
                        <AccountAssetsList />
                    {/if}
                </Pane>
                <Pane>
                    {#if features?.wallet?.activityHistory?.enabled}
                        <AccountActivity />
                    {/if}
                </Pane>
            </div>
        {/key}
    </div>
{/if}
