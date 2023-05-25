<script lang="ts">
    import { onDestroy } from 'svelte'
    import { Button, KeyValueBox, Text, TextHint, FontWeight, TextType } from 'shared/components'
    import { closeOverlay, openOverlay, PopupId } from '@auxiliary/popup'
    import { showAppNotification } from '@auxiliary/notification'
    import { displayNotificationForLedgerProfile, ledgerNanoStatus } from '@core/ledger'
    import { sumBalanceForAccounts } from '@core/account'
    import { localize } from '@core/i18n'
    import {
        activeAccounts,
        activeProfile,
        getBaseToken,
        DEFAULT_ACCOUNT_RECOVERY_CONFIGURATION,
        isActiveLedgerProfile,
        isSoftwareProfile,
        loadAccounts,
        visibleActiveAccounts,
    } from '@core/profile'
    import { RecoverAccountsPayload, recoverAccounts } from '@core/profile-manager'
    import {
        formatTokenAmountBestMatch,
        generateAndStoreActivitiesForAllAccounts,
        refreshAccountAssetsForActiveProfile,
    } from '@core/wallet'
    import { loadNftsForActiveProfile } from '@core/nfts'
    import { DEFAULT_SYNC_OPTIONS } from '@core/account/constants'

    export let searchForBalancesOnLoad = false

    const { isStrongholdLocked, type } = $activeProfile

    const initialAccountRange = DEFAULT_ACCOUNT_RECOVERY_CONFIGURATION[type].initialAccountRange
    const addressGapLimitIncrement = DEFAULT_ACCOUNT_RECOVERY_CONFIGURATION[type].addressGapLimit
    let previousAccountGapLimit = 0
    let previousAddressGapLimit = 0
    let currentAccountGapLimit = initialAccountRange
    let currentAddressGapLimit = addressGapLimitIncrement
    let error = ''
    let isBusy = false
    let hasUsedWalletFinder = false

    $: searchForBalancesOnLoad && !$isStrongholdLocked && onFindBalancesClick()
    $: totalBalance = sumBalanceForAccounts($visibleActiveAccounts)

    async function onFindBalancesClick(): Promise<void> {
        if ($isSoftwareProfile && $isStrongholdLocked) {
            openOverlay({
                id: PopupId.UnlockStronghold,
                props: {
                    onSuccess: function () {
                        openOverlay({
                            id: PopupId.WalletFinder,
                            props: { searchForBalancesOnLoad: true },
                        })
                    },
                    onCancelled: function () {
                        openOverlay({
                            id: PopupId.WalletFinder,
                        })
                    },
                },
            })
        } else {
            try {
                error = ''
                isBusy = true

                if ($isActiveLedgerProfile && !$ledgerNanoStatus.connected) {
                    isBusy = false
                    displayNotificationForLedgerProfile('warning')
                    return
                }

                const recoverAccountsPayload: RecoverAccountsPayload = {
                    accountStartIndex: 0,
                    accountGapLimit: currentAccountGapLimit,
                    addressGapLimit: currentAddressGapLimit,
                    syncOptions: DEFAULT_SYNC_OPTIONS,
                }
                await recoverAccounts(recoverAccountsPayload)
                await loadAccounts()

                previousAccountGapLimit = currentAccountGapLimit
                previousAddressGapLimit = currentAddressGapLimit
                currentAccountGapLimit += initialAccountRange
                currentAddressGapLimit += addressGapLimitIncrement

                hasUsedWalletFinder = true
            } catch (err) {
                error = localize(err.error)

                if ($isActiveLedgerProfile) {
                    displayNotificationForLedgerProfile('error', true, true, err)
                } else {
                    showAppNotification({
                        type: 'error',
                        message: localize(err.error),
                    })
                }
            } finally {
                isBusy = false
            }
        }
    }

    function onCancelClick(): void {
        closeOverlay()
    }

    onDestroy(async () => {
        if (hasUsedWalletFinder) {
            await refreshAccountAssetsForActiveProfile()
            await generateAndStoreActivitiesForAllAccounts()
            loadNftsForActiveProfile()
        }
    })
</script>

<Text type={TextType.h4} fontSize="18" lineHeight="6" fontWeight={FontWeight.semibold} classes="mb-6"
    >{localize('popups.walletFinder.title')}</Text
>

<div class="space-y-4">
    <Text type={TextType.p} color="gray-600" fontSize="15" lineHeight="5">{localize('popups.walletFinder.body')}</Text>

    <div class="w-full flex-col space-y-2">
        <KeyValueBox
            keyText={localize('popups.walletFinder.accountsSearched')}
            valueText={previousAccountGapLimit.toString() || '-'}
        />
        <KeyValueBox
            keyText={localize('popups.walletFinder.accountsFound')}
            valueText={$activeAccounts.length.toString() || '0'}
        />
        <KeyValueBox
            keyText={localize('popups.walletFinder.totalWalletBalance')}
            valueText={formatTokenAmountBestMatch(totalBalance, getBaseToken())}
        />
    </div>

    {#if hasUsedWalletFinder}
        <TextHint info icon="exclamation" text={localize('popups.walletFinder.searchAgainHint')} />
    {/if}
</div>

<div class="flex flex-row flex-nowrap w-full space-x-4 mt-6">
    <Button classes="w-full" outline onClick={onCancelClick} disabled={isBusy}>
        {localize('actions.cancel')}
    </Button>
    <Button
        classes="w-full"
        onClick={onFindBalancesClick}
        disabled={isBusy}
        {isBusy}
        busyMessage={localize('actions.searching')}
    >
        {#if hasUsedWalletFinder}
            {localize('actions.searchAgain')}
        {:else}
            {localize('actions.search')}
        {/if}
    </Button>
</div>
