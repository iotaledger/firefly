<script lang="ts">
    import { onDestroy } from 'svelte'
    import { Button, Icon, Text, TextHint, FontWeight, TextType, Tile } from 'shared/components'
    import { closePopup, openPopup, PopupId } from '@auxiliary/popup'
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
    import { TextHintVariant } from 'shared/components/enums'
    import { Icon as IconEnum } from '@auxiliary/icon'
    import VirtualList from '@sveltejs/svelte-virtual-list'

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
            openPopup({
                id: PopupId.UnlockStronghold,
                props: {
                    onSuccess: function () {
                        openPopup({
                            id: PopupId.BalanceOverview,
                            props: { searchForBalancesOnLoad: true },
                        })
                    },
                    onCancelled: function () {
                        openPopup({
                            id: PopupId.BalanceOverview,
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
                    syncOptions: { syncOnlyMostBasicOutputs: true },
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
        closePopup()
    }

    onDestroy(async () => {
        if (hasUsedWalletFinder) {
            await refreshAccountAssetsForActiveProfile()
            await generateAndStoreActivitiesForAllAccounts()
        }
    })
</script>

<Text type={TextType.h4} fontSize="18" lineHeight="6" fontWeight={FontWeight.semibold} classes="mb-6"
    >{localize('popups.balanceOverview.title')}</Text
>

<div class="space-y-4">
    <Text type={TextType.p} color="gray-600" fontSize="15" lineHeight="5"
        >{localize('popups.balanceOverview.body')}</Text
    >

    <div class="w-full flex-col space-y-2 balance-overview-wrapper">
        <VirtualList items={$activeAccounts} let:item>
            <div class="mb-2">
                <Tile classes="flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-1000">
                    <div class="flex items-center space-x-2">
                        <Icon icon={IconEnum.Wallet} width={28} height={28} classes="text-blue-500" />
                        <Text classes="text-right">{item.name}</Text>
                    </div>
                    <Text classes="text-right">
                        {formatTokenAmountBestMatch(Number(item.balances.baseCoin.total), getBaseToken())}</Text
                    >
                </Tile>
            </div>
        </VirtualList>
        <Tile isGhost classes="flex justify-between">
            <Text type={TextType.h5}>{localize('popups.balanceOverview.total')}:</Text>
            <Text type={TextType.h5}>{formatTokenAmountBestMatch(totalBalance, getBaseToken())}</Text>
        </Tile>
        <TextHint
            variant={TextHintVariant.Info}
            icon={IconEnum.Exclamation}
            text={localize('popups.balanceOverview.searchAgainHint')}
        />
    </div>
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
