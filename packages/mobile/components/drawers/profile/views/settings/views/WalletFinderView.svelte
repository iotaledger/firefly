<script lang="ts">
    import { onDestroy } from 'svelte'

    import { Button, KeyValueBox, Text, TextHint } from '@ui'
    import { ButtonSize, TextType } from '@ui/enums'

    import { DEFAULT_SYNC_OPTIONS, sumBalanceForAccounts } from '@core/account'
    import { localize } from '@core/i18n'
    import { displayNotificationForLedgerProfile, ledgerNanoStatus } from '@core/ledger'
    import { loadNftsForActiveProfile } from '@core/nfts'
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
    import { recoverAccounts, RecoverAccountsPayload } from '@core/profile-manager'
    import {
        formatTokenAmountBestMatch,
        generateAndStoreActivitiesForAllAccounts,
        refreshAccountAssetsForActiveProfile,
    } from '@core/wallet'

    import { showAppNotification } from '@auxiliary/notification'

    import { DrawerId, openDrawer } from '@/auxiliary/drawer'
    import { TextHintVariant } from 'shared/components/enums'
    import { Icon as IconEnum } from '@auxiliary/icon'

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

    $: searchForBalancesOnLoad && !$isStrongholdLocked && handleFindBalances()
    $: totalBalance = sumBalanceForAccounts($visibleActiveAccounts)

    function onSearchClick(): void {
        if ($isSoftwareProfile && $isStrongholdLocked) {
            openDrawer(DrawerId.EnterPassword, { onSuccess: handleFindBalances })
        } else {
            void handleFindBalances()
        }
    }

    async function handleFindBalances(): Promise<void> {
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

    onDestroy(async () => {
        if (hasUsedWalletFinder) {
            await refreshAccountAssetsForActiveProfile()
            await generateAndStoreActivitiesForAllAccounts()
            loadNftsForActiveProfile()
        }
    })
</script>

<wallet-finder-view class="flex-1 flex flex-col justify-between space-y-4">
    <div class="flex flex-col space-y-4">
        <Text type={TextType.p} color="gray-600" fontSize="15" lineHeight="5">
            {localize('popups.walletFinder.body')}
        </Text>
        <div class="w-full flex-col space-y-2">
            <KeyValueBox
                keyText={localize('popups.walletFinder.accountsSearched')}
                valueText={previousAccountGapLimit.toString() || '-'}
            />
            <KeyValueBox
                keyText={localize('popups.walletFinder.accountsFound')}
                valueText={$activeAccounts?.length?.toString() || '0'}
            />
            <KeyValueBox
                keyText={localize('popups.walletFinder.totalWalletBalance')}
                valueText={formatTokenAmountBestMatch(totalBalance, getBaseToken())}
            />
        </div>
        {#if hasUsedWalletFinder}
            <TextHint
                variant={TextHintVariant.Info}
                icon={IconEnum.Exclamation}
                text={localize('popups.walletFinder.searchAgainHint')}
            />
        {/if}
    </div>
    <Button
        classes="w-full"
        size={ButtonSize.Medium}
        onClick={onSearchClick}
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
</wallet-finder-view>
