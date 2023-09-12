<script lang="ts">
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { showAppNotification } from '@auxiliary/notification'
    import { PopupId, closePopup, openPopup } from '@auxiliary/popup'
    import { findBalances, sumBalanceForAccounts, SearchAlgorithmType } from '@core/account'
    import { localize } from '@core/i18n'
    import { displayNotificationForLedgerProfile, ledgerNanoStatus } from '@core/ledger'
    import { NetworkId } from '@core/network'
    import { loadNftsForActiveProfile } from '@core/nfts'
    import {
        activeProfile,
        getBaseToken,
        isActiveLedgerProfile,
        isSoftwareProfile,
        loadAccounts,
        visibleActiveAccounts,
    } from '@core/profile'
    import {
        formatTokenAmountBestMatch,
        generateAndStoreActivitiesForAllAccounts,
        refreshAccountAssetsForActiveProfile,
    } from '@core/wallet'
    import { Button, FontWeight, KeyValueBox, Text, TextHint, TextType, Icon, Tile } from 'shared/components'
    import { TextHintVariant } from 'shared/components/enums'
    import { onDestroy } from 'svelte'
    import VirtualList from '@sveltejs/svelte-virtual-list'

    export let searchForBalancesOnLoad = false
    export let hasUsedBalanceFinder = false
    export let title: string
    export let body: string

    const { isStrongholdLocked, network } = $activeProfile
    const searchAlgorithm: SearchAlgorithmType =
        network.id === NetworkId.Iota || NetworkId.IotaAlphanet ? SearchAlgorithmType.IDS : SearchAlgorithmType.BFS

    let error = ''
    let isBusy = false

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
                            props: { searchForBalancesOnLoad: true, hasUsedBalanceFinder, title, body },
                        })
                    },
                    onCancelled: function () {
                        openPopup({
                            id: PopupId.BalanceFinder,
                            props: { title, body },
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
                await findBalances(searchAlgorithm, !hasUsedBalanceFinder)
                await loadAccounts()
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

<Text type={TextType.h4} fontSize="18" lineHeight="6" fontWeight={FontWeight.semibold} classes="mb-6">
    {title}
</Text>
<div class="space-y-4">
    <Text type={TextType.p} color="gray-600" fontSize="15" lineHeight="5">{body}</Text>

    <div class="w-full flex-col space-y-2 balance-overview-wrapper">
        <VirtualList items={$visibleActiveAccounts} let:item>
            <div class="mb-2">
                <Tile classes="flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-1000">
                    <div class="flex items-center space-x-2">
                        <Icon icon={IconEnum.Wallet} width={28} height={28} classes="text-blue-500" />
                        <Text classes="text-right">{item.name}</Text>
                    </div>
                    <Text classes="text-right">
                        {formatTokenAmountBestMatch(Number(item.balances.baseCoin.total), getBaseToken())}
                    </Text>
                </Tile>
            </div>
        </VirtualList>
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
