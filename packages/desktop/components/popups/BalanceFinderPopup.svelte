<script lang="ts">
    import { get } from 'svelte/store'
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { showAppNotification } from '@auxiliary/notification'
    import { PopupId, closePopup, openPopup } from '@auxiliary/popup'
    import { sumBalanceForWallets, SearchAlgorithmType, selectedWalletId } from '@core/wallet'
    import { localize } from '@core/i18n'
    import { displayNotificationForLedgerProfile, ledgerNanoStatus } from '@core/ledger'
    import { NetworkId } from '@core/network'
    import { loadNftsForActiveProfile } from '@core/nfts'
    import {
        activeProfile,
        getBaseToken,
        isActiveLedgerProfile,
        isSoftwareProfile,
        loadWallets,
        visibleActiveWallets,
    } from '@core/profile'
    import {
        formatTokenAmountBestMatch,
        generateAndStoreActivitiesForAllWallets,
        refreshWalletAssetsForActiveProfile,
    } from '@core/wallet'
    import { Button, FontWeight, KeyValueBox, Text, TextHint, TextType, Icon, Tile, Spinner, Checkbox } from '@ui'
    import { TextHintVariant } from '@ui/enums'
    import { onDestroy } from 'svelte'
    import VirtualList from '@sveltejs/svelte-virtual-list'
    import { consolidateOutputs } from '@core/wallet/actions/consolidateOutputs'

    export let searchForBalancesOnLoad = false
    export let hasUsedBalanceFinder = false
    export let showConsolidation = false
    export let consolidateWalletsOnLoad = false
    export let title: string
    export let body: string
    export let searchInCurrentWallet: boolean = false
    export let shouldInitSearch: boolean = false

    let error = ''
    let isBusy = false

    const { isStrongholdLocked, network } = $activeProfile

    $: isTransferring = $visibleActiveWallets.some(
        (_wallet) => _wallet.hasConsolidatingOutputsTransactionInProgress || _wallet.isTransferring
    )
    $: visibleWalletList = searchInCurrentWallet
        ? $visibleActiveWallets?.filter((_wallet) => _wallet.id === $selectedWalletId)
        : $visibleActiveWallets
    $: searchForBalancesOnLoad && !$isStrongholdLocked && onFindBalancesClick()
    $: consolidateWalletsOnLoad && !$isStrongholdLocked && onConsolidateWalletsClick()
    $: totalBalance = sumBalanceForWallets($visibleActiveWallets)
    $: searchInCurrentWallet, (shouldInitSearch = true)
    $: searchAlgorithm = searchInCurrentWallet
        ? SearchAlgorithmType.DFS
        : network.id === NetworkId.Iota || NetworkId.IotaAlphanet
        ? SearchAlgorithmType.IDS
        : SearchAlgorithmType.BFS

    // Button click handlers
    async function onFindBalancesClick(): Promise<void> {
        if ($isSoftwareProfile && $isStrongholdLocked) {
            openUnlockStrongholdPopup(true, false)
        } else {
            isBusy = true
            await handleAction(findProfileBalances)
            isBusy = false
        }
    }

    async function onConsolidateWalletsClick(): Promise<void> {
        if ($isSoftwareProfile && $isStrongholdLocked) {
            openUnlockStrongholdPopup(false, true)
        } else {
            await handleAction(consolidateProfileWallets)
        }
    }

    function onCancelClick(): void {
        closePopup()
    }

    // Actions
    async function findProfileBalances(): Promise<void> {
        //await findBalances(searchAlgorithm, !hasUsedBalanceFinder || shouldInitSearch)
        await loadWallets()
        hasUsedBalanceFinder = true
        shouldInitSearch = false
    }

    async function consolidateProfileWallets(): Promise<void> {
        const consolidationPromises: Promise<void>[] = []

        for (const wallet of get(visibleActiveWallets)) {
            consolidationPromises.push(consolidateOutputs(wallet))
        }

        await Promise.all(consolidationPromises)
    }

    async function handleAction(callback: () => Promise<void>): Promise<void> {
        try {
            error = ''

            if ($isActiveLedgerProfile && !$ledgerNanoStatus.connected) {
                isBusy = false
                displayNotificationForLedgerProfile('warning')
                return
            }

            await callback()
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
        }
    }

    function openUnlockStrongholdPopup(searchForBalancesOnLoad: boolean, consolidateWalletsOnLoad: boolean) {
        openPopup({
            id: PopupId.UnlockStronghold,
            props: {
                onSuccess: function () {
                    openPopup({
                        id: PopupId.BalanceFinder,
                        props: {
                            searchForBalancesOnLoad,
                            consolidateWalletsOnLoad,
                            showConsolidation,
                            hasUsedBalanceFinder,
                            title,
                            body,
                            searchInCurrentWallet,
                            shouldInitSearch,
                        },
                    })
                },
                onCancelled: function () {
                    openPopup({
                        id: PopupId.BalanceFinder,
                        props: {
                            hasUsedBalanceFinder,
                            title,
                            body,
                            showConsolidation,
                            searchInCurrentWallet,
                            shouldInitSearch,
                        },
                    })
                },
            },
        })
    }

    onDestroy(async () => {
        if (hasUsedBalanceFinder) {
            await refreshWalletAssetsForActiveProfile()
            await generateAndStoreActivitiesForAllWallets()
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
        <VirtualList items={visibleWalletList} let:item>
            <div class="mb-2">
                <Tile classes="flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-1000">
                    <div class="flex items-center space-x-2">
                        <Icon icon={IconEnum.Wallet} width={28} height={28} classes="text-blue-500" />
                        <Text classes="text-right">{item.name}</Text>
                        {#if item.hasConsolidatingOutputsTransactionInProgress}
                            <Spinner />
                        {/if}
                    </div>
                    <Text classes="text-right">
                        {formatTokenAmountBestMatch(Number(item.balances.baseCoin.total), getBaseToken())}
                    </Text>
                </Tile>
            </div>
        </VirtualList>
        {#if !searchInCurrentWallet}
            <KeyValueBox
                keyText={localize('popups.balanceFinder.totalAddressBalance')}
                valueText={formatTokenAmountBestMatch(totalBalance, getBaseToken())}
            />
        {/if}
    </div>
    <Checkbox
        label={localize('popups.balanceFinder.currentWallet')}
        checked={searchInCurrentWallet}
        onClick={() => (searchInCurrentWallet = !searchInCurrentWallet)}
        disabled={isBusy}
    />

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
        disabled={isBusy || isTransferring}
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

{#if showConsolidation}
    <div class="flex flex-col flex-nowrap w-full space-y-4 mt-6">
        <TextHint
            variant={TextHintVariant.Info}
            icon={IconEnum.Exclamation}
            text={localize('popups.minimizeStorageDeposit.description')}
        />
        <Button
            classes="w-full"
            onClick={onConsolidateWalletsClick}
            disabled={isBusy || isTransferring}
            isBusy={isTransferring}
            busyMessage={localize('popups.minimizeStorageDeposit.title')}
        >
            {localize('popups.minimizeStorageDeposit.title')}
        </Button>
    </div>
{/if}

<style lang="scss">
    .balance-overview-wrapper :global(svelte-virtual-list-viewport) {
        margin-right: -1rem !important;
        flex: auto;
        overflow-y: scroll;
        padding-right: 1.5rem !important;
        min-height: 100px;
        max-height: 250px;
    }
    .balance-overview-wrapper :global(svelte-virtual-list-contents) {
        margin-right: -1rem !important;
    }
</style>
