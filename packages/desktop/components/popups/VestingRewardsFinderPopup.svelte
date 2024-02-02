<script lang="ts">
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { showAppNotification } from '@auxiliary/notification'
    import { PopupId, closePopup, openPopup } from '@auxiliary/popup'
    import { selectedWalletVestingOverview } from '@contexts/vesting'
    import { SearchAlgorithmType, findBalances } from '@core/wallet'
    import { selectedWallet } from '@core/wallet/stores'
    import { localize } from '@core/i18n'
    import { displayNotificationForLedgerProfile, ledgerNanoStatus } from '@core/ledger'
    import { loadNftsForActiveProfile } from '@core/nfts'
    import {
        BALANCE_FINDER_ACCOUNT_RECOVERY_CONFIGURATION,
        RecoverAccountsPayload,
        activeProfile,
        getBaseToken,
        isActiveLedgerProfile,
        isSoftwareProfile,
        loadWallets,
    } from '@core/profile'
    import { truncateString } from '@core/utils'
    import {
        formatTokenAmountBestMatch,
        generateAndStoreActivitiesForAllWallets,
        refreshWalletAssetsForActiveProfile,
    } from '@core/wallet'
    import VirtualList from '@sveltejs/svelte-virtual-list'
    import { Button, FontWeight, KeyValueBox, Text, TextHint, TextType } from 'shared/components'
    import { TextHintVariant } from 'shared/components/enums'
    import { onDestroy } from 'svelte'

    export let searchForBalancesOnLoad = false
    export let hasUsedVestingRewardsFinder = false

    const { isStrongholdLocked, type } = $activeProfile
    const config: RecoverAccountsPayload = {
        accountStartIndex: $selectedWallet.id, // TODO(2.0) Index?
        accountGapLimit: 0,
        addressGapLimit: BALANCE_FINDER_ACCOUNT_RECOVERY_CONFIGURATION[type].addressGapLimit,
    }

    let error = ''
    let isBusy = false

    $: searchForBalancesOnLoad && !$isStrongholdLocked && onFindBalancesClick()

    async function onFindBalancesClick(): Promise<void> {
        if ($isSoftwareProfile && $isStrongholdLocked) {
            openPopup({
                id: PopupId.UnlockStronghold,
                props: {
                    onSuccess: function () {
                        openPopup({
                            id: PopupId.VestingRewardsFinder,
                            props: { searchForBalancesOnLoad: true, hasUsedVestingRewardsFinder },
                        })
                    },
                    onCancelled: function () {
                        openPopup({
                            id: PopupId.VestingRewardsFinder,
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
                await findBalances(SearchAlgorithmType.DFS, !hasUsedVestingRewardsFinder, config)
                await loadWallets()
                hasUsedVestingRewardsFinder = true
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
        if (hasUsedVestingRewardsFinder) {
            await refreshWalletAssetsForActiveProfile()
            await generateAndStoreActivitiesForAllWallets()
            loadNftsForActiveProfile()
        }
    })
</script>

<Text type={TextType.h4} fontSize="18" lineHeight="6" fontWeight={FontWeight.semibold} classes="mb-6">
    {localize('popups.vestingRewards.title')}
</Text>
<div class="space-y-4">
    <Text type={TextType.p} color="gray-600" fontSize="15" lineHeight="5">{localize('popups.vestingRewards.body')}</Text
    >

    <div class="w-full flex-col space-y-2 balance-overview-wrapper">
        <VirtualList items={$selectedWalletVestingOverview.rewardsPerAddresses} let:item>
            <div class="mb-1">
                <KeyValueBox
                    isCopyable
                    classes="flex items-center w-full py-4"
                    keyText={truncateString(item?.address, 14, 14)}
                    valueText={formatTokenAmountBestMatch(Math.round(item?.amount), getBaseToken())}
                    copyValue={item.address}
                    backgroundColor="gray-50"
                    darkBackgroundColor="gray-900"
                />
            </div>
        </VirtualList>
        <KeyValueBox
            keyText={localize('popups.vestingRewards.totalAddressBalance')}
            valueText={formatTokenAmountBestMatch(
                Math.round($selectedWalletVestingOverview.totalRewards),
                getBaseToken()
            )}
        />
    </div>

    {#if hasUsedVestingRewardsFinder}
        <TextHint
            variant={TextHintVariant.Info}
            icon={IconEnum.Exclamation}
            text={localize('popups.vestingRewards.searchAgainHint')}
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
        {#if hasUsedVestingRewardsFinder}
            {localize('actions.searchAgain')}
        {:else}
            {localize('actions.search')}
        {/if}
    </Button>
</div>

<style lang="scss">
    .balance-overview-wrapper :global(svelte-virtual-list-viewport) {
        margin-right: -1rem !important;
        flex: auto;
        overflow-y: scroll;
        padding-right: 1.5rem !important;
        min-height: 100px;
        max-height: 300px;
    }
    .balance-overview-wrapper :global(svelte-virtual-list-contents) {
        margin-right: -1rem !important;
    }
</style>
