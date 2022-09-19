<script lang="typescript">
    import { onDestroy } from 'svelte'
    import { Button, KeyValueBox, Text, TextHint } from 'shared/components'
    import { FontWeight } from '../Text.svelte'
    import { closePopup, openPopup } from '@lib/popup'
    import { showAppNotification } from '@lib/notifications'
    import { displayNotificationForLedgerProfile, ledgerNanoStatus } from '@core/ledger'
    import { sumBalanceForAccounts } from '@core/account'
    import { localize } from '@core/i18n'
    import { BASE_TOKEN } from '@core/network'
    import {
        activeAccounts,
        activeProfile,
        INITIAL_ACCOUNT_GAP_LIMIT,
        INITIAL_ADDRESS_GAP_LIMIT,
        isActiveLedgerProfile,
        isSoftwareProfile,
        loadAccounts,
        visibleActiveAccounts,
    } from '@core/profile'
    import { recoverAccounts } from '@core/profile-manager'
    import {
        formatTokenAmountBestMatch,
        generateAndStoreActivitiesForAllAccounts,
        refreshAccountAssetsForActiveProfile,
    } from '@core/wallet'

    export let searchForBalancesOnLoad = false

    const { isStrongholdLocked, type } = $activeProfile

    const accountGapLimitIncrement = INITIAL_ACCOUNT_GAP_LIMIT[type]
    const addressGapLimitIncrement = INITIAL_ADDRESS_GAP_LIMIT[type]
    let previousAccountGapLimit = 0
    let previousAddressGapLimit = 0
    let currentAccountGapLimit = accountGapLimitIncrement
    let currentAddressGapLimit = addressGapLimitIncrement
    let error = ''
    let isBusy = false
    let hasUsedWalletFinder = false

    $: searchForBalancesOnLoad && !$isStrongholdLocked && handleFindBalances()
    $: totalBalance = sumBalanceForAccounts($visibleActiveAccounts)

    async function handleFindBalances() {
        if ($isSoftwareProfile && $isStrongholdLocked) {
            openPopup({
                type: 'unlockStronghold',
                props: {
                    onSuccess: function () {
                        openPopup({
                            type: 'walletFinder',
                            props: { searchForBalancesOnLoad: true },
                        })
                    },
                    onCancelled: function () {
                        openPopup({
                            type: 'walletFinder',
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

                await recoverAccounts(currentAccountGapLimit, currentAddressGapLimit, {
                    syncIncomingTransactions: true,
                })
                await loadAccounts()

                previousAccountGapLimit = currentAccountGapLimit
                previousAddressGapLimit = currentAddressGapLimit
                currentAccountGapLimit += accountGapLimitIncrement
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

    function handleCancelClick() {
        closePopup()
    }

    onDestroy(async () => {
        if (hasUsedWalletFinder) {
            await refreshAccountAssetsForActiveProfile()
            await generateAndStoreActivitiesForAllAccounts()
        }
    })
</script>

<Text type="h4" fontSize="18" lineHeight="6" fontWeight={FontWeight.semibold} classes="mb-6"
    >{localize('popups.walletFinder.title')}</Text
>

<div class="space-y-4">
    <Text type="p" color="gray-600" fontSize="15" lineHeight="5">{localize('popups.walletFinder.body')}</Text>

    <div class="w-full flex-col space-y-2">
        <KeyValueBox
            keyText={localize('popups.walletFinder.accountsSearched')}
            valueText={previousAccountGapLimit || '-'}
        />
        <KeyValueBox
            keyText={localize('popups.walletFinder.accountsFound')}
            valueText={$activeAccounts.length || '0'}
        />
        <KeyValueBox
            keyText={localize('popups.walletFinder.totalWalletBalance')}
            valueText={formatTokenAmountBestMatch(totalBalance, BASE_TOKEN[$activeProfile.networkProtocol])}
        />
    </div>

    {#if hasUsedWalletFinder}
        <TextHint info icon="exclamation" text={localize('popups.walletFinder.searchAgainHint')} />
    {/if}
</div>

<div class="flex flex-row flex-nowrap w-full space-x-4 mt-6">
    <Button classes="w-full" outline onClick={handleCancelClick} disabled={isBusy}>
        {localize('actions.cancel')}
    </Button>
    <Button
        classes="w-full"
        onClick={handleFindBalances}
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
