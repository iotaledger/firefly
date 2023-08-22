<script lang="ts">
    import { onDestroy } from 'svelte'
    import { Button, KeyValueBox, Text, TextHint, FontWeight, TextType } from 'shared/components'
    import { closePopup, openPopup, PopupId } from '@auxiliary/popup'
    import { showAppNotification } from '@auxiliary/notification'
    import { displayNotificationForLedgerProfile, ledgerNanoStatus } from '@core/ledger'
    import { DEFAULT_SYNC_OPTIONS, selectedAccount, sumBalanceForAccounts, syncBalance } from '@core/account'
    import { localize } from '@core/i18n'
    import {
        activeProfile,
        getBaseToken,
        isActiveLedgerProfile,
        isSoftwareProfile,
        visibleActiveAccounts,
    } from '@core/profile'
    import {
        formatTokenAmountBestMatch,
        generateAndStoreActivitiesForAllAccounts,
        refreshAccountAssetsForActiveProfile,
    } from '@core/wallet'
    import { loadNftsForActiveProfile } from '@core/nfts'
    import { TextHintVariant } from 'shared/components/enums'
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { recoverAccounts } from '@core/profile-manager'

    export let searchForBalancesOnLoad = false

    const { isStrongholdLocked } = $activeProfile
    const INCREASE_GAP_LIMIT = 10

    let error = ''
    let addressIndex = 0
    let isBusy = false
    let hasUsedBalanceFinder = false

    $: searchForBalancesOnLoad && !$isStrongholdLocked && onFindBalancesClick()
    $: totalBalance = sumBalanceForAccounts($visibleActiveAccounts)

    async function onFindBalancesClick(): Promise<void> {
        if ($isSoftwareProfile && $isStrongholdLocked) {
            openPopup({
                id: PopupId.UnlockStronghold,
                props: {
                    onSuccess: function () {
                        openPopup({
                            id: PopupId.BalanceFinder,
                            props: { searchForBalancesOnLoad: true },
                        })
                    },
                    onCancelled: function () {
                        openPopup({
                            id: PopupId.BalanceFinder,
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
                await syncBalance($selectedAccount.index)

                await recoverAccounts({
                    accountStartIndex: addressIndex,
                    accountGapLimit: 1,
                    addressGapLimit: INCREASE_GAP_LIMIT,
                    syncOptions: { ...DEFAULT_SYNC_OPTIONS, addressStartIndex: addressIndex },
                })

                addressIndex += INCREASE_GAP_LIMIT
                hasUsedBalanceFinder = true
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
        closePopup()
    }

    onDestroy(async () => {
        if (hasUsedBalanceFinder) {
            await refreshAccountAssetsForActiveProfile()
            await generateAndStoreActivitiesForAllAccounts()
            loadNftsForActiveProfile()
        }
    })
</script>

<Text type={TextType.h4} fontSize="18" lineHeight="6" fontWeight={FontWeight.semibold} classes="mb-6"
    >{localize('popups.balanceFinder.title')}</Text
>

<div class="space-y-4">
    <Text type={TextType.p} color="gray-600" fontSize="15" lineHeight="5">{localize('popups.balanceFinder.body')}</Text>

    <div class="w-full flex-col space-y-2">
        <KeyValueBox
            keyText={localize('popups.balanceFinder.addressesSearched')}
            valueText={addressIndex.toString() || '-'}
        />
        <KeyValueBox
            keyText={localize('popups.balanceFinder.addressesFound')}
            valueText={$selectedAccount?.addressesWithOutputs?.length?.toString() || '0'}
        />
        <KeyValueBox
            keyText={localize('popups.balanceFinder.totalAddressBalance')}
            valueText={formatTokenAmountBestMatch(totalBalance, getBaseToken())}
        />
    </div>

    {#if hasUsedBalanceFinder}
        <TextHint
            variant={TextHintVariant.Info}
            icon={IconEnum.Exclamation}
            text={localize('popups.balanceFinder.searchAgainHint')}
        />
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
        {#if hasUsedBalanceFinder}
            {localize('actions.searchAgain')}
        {:else}
            {localize('actions.search')}
        {/if}
    </Button>
</div>
