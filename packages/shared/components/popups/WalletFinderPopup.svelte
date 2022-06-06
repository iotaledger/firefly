<script lang="typescript">
    import { Button, KeyValueBox, Spinner, Text, TextHint } from 'shared/components'
    import { closePopup, openPopup } from 'shared/lib/popup'
    import { asyncSyncAccounts } from 'shared/lib/wallet'
    import { showAppNotification } from 'shared/lib/notifications'
    import { displayNotificationForLedgerProfile, isLedgerConnected } from 'shared/lib/ledger'
    import { localize } from '@core/i18n'
    import { cacheAllStakingPeriods, StakingAirdrop } from '@lib/participation'
    import { onDestroy } from 'svelte'
    import { activeAccounts, activeProfile, isLedgerProfile, isSoftwareProfile } from '@core/profile'
    import { FontWeightText } from '../Text.svelte'

    export let searchForBalancesOnLoad = false

    const { balanceOverview, isStrongholdLocked } = $activeProfile

    const startAddressIndex = 0
    const gapLimitIncrement = $isLedgerProfile ? 10 : 25
    let previousGapLimit = 0
    let currentGapLimit = gapLimitIncrement
    let previousAccountDiscoveryThreshold = 0
    let accountDiscoveryThreshold = $isLedgerProfile ? 3 : 10
    let error = ''
    let isBusy = false
    let hasUsedWalletFinder = false

    $: searchForBalancesOnLoad && !$isStrongholdLocked && handleFindBalances()

    async function handleFindBalances() {
        if ($isSoftwareProfile && $isStrongholdLocked) {
            openPopup({
                type: 'password',
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

                if ($isLedgerProfile && !isLedgerConnected()) {
                    isBusy = false

                    displayNotificationForLedgerProfile('warning')

                    return
                }

                await asyncSyncAccounts(startAddressIndex, currentGapLimit, accountDiscoveryThreshold, false)

                previousGapLimit = currentGapLimit
                currentGapLimit += gapLimitIncrement
                previousAccountDiscoveryThreshold = accountDiscoveryThreshold++
                hasUsedWalletFinder = true
            } catch (err) {
                error = localize(err.error)

                if ($isLedgerProfile) {
                    displayNotificationForLedgerProfile('error', true, true, false, false, err)
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

    onDestroy(() => {
        // todo: (Jason) Remove this
        if (hasUsedWalletFinder) {
            cacheAllStakingPeriods(StakingAirdrop.Assembly)
            cacheAllStakingPeriods(StakingAirdrop.Shimmer)
        }
    })
</script>

<Text type="h4" fontSize="18" lineHeight="6" fontWeight={FontWeightText.semibold} classes="mb-6"
    >{localize('popups.walletFinder.title')}</Text
>

<div class="space-y-4">
    <Text type="p" color="gray-600" fontSize="15" lineHeight="5">{localize('popups.walletFinder.body')}</Text>

    <div class="w-full flex-col space-y-2">
        <KeyValueBox
            keyText={localize('popups.walletFinder.accountsSearched')}
            valueText={previousAccountDiscoveryThreshold || '-'}
        />
        <KeyValueBox
            keyText={localize('popups.walletFinder.accountsFound')}
            valueText={$activeAccounts.length || '0'}
        />
        <KeyValueBox
            keyText={localize('popups.walletFinder.totalWalletBalance')}
            valueText={$balanceOverview.balance}
        />
    </div>

    {#if hasUsedWalletFinder}
        <TextHint
            classes="w-full rounded-2xl bg-gray-50 dark:bg-gray-850 py-4 pl-4 pr-8"
            icon="exclamation"
            iconClasses="w-4.5 h-4.5 fill-current text-blue-500 dark:text-blue-500 mr-4"
            hint={localize('popups.walletFinder.searchAgainHint')}
            hintColor="gray-600"
            hintDarkColor="gray-500"
        />
    {/if}
</div>

<div class="flex flex-row flex-nowrap w-full space-x-4 mt-6">
    <Button classes="w-full" secondary onClick={handleCancelClick} disabled={isBusy}>
        {localize('actions.cancel')}
    </Button>
    <Button classes="w-full" onClick={handleFindBalances} disabled={isBusy}>
        {#if isBusy}
            <Spinner busy={true} message={localize('actions.searching')} classes="justify-center" />
        {:else}{localize('actions.searchBalances')}{/if}
    </Button>
</div>
