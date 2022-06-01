<script lang="typescript">
    import { Button, KeyValueBox, Password, Spinner, Text, TextHint } from 'shared/components'
    import { closePopup } from 'shared/lib/popup'
    import { asyncSyncAccounts } from 'shared/lib/wallet'
    import { showAppNotification } from 'shared/lib/notifications'
    import { displayNotificationForLedgerProfile, isLedgerConnected } from 'shared/lib/ledger'
    import { localize } from '@core/i18n'
    import { cacheAllStakingPeriods, StakingAirdrop } from '@lib/participation'
    import { onDestroy } from 'svelte'
    import { activeAccounts, activeProfile, isLedgerProfile, isSoftwareProfile } from '@core/profile'
    import { setStrongholdPassword } from '@core/profile-manager'
    import { FontWeightText } from '../Text.svelte'

    const { balanceOverview, accounts, isStrongholdLocked } = $activeProfile

    const startAddressIndex = 0
    const gapLimitIncrement = $isLedgerProfile ? 10 : 25
    let previousGapLimit = 0
    let currentGapLimit = gapLimitIncrement
    let previousAccountDiscoveryThreshold = 0
    let accountDiscoveryThreshold = $isLedgerProfile ? 3 : 10
    let password = ''
    let error = ''
    let isBusy = false
    let hasUsedBalanceFinder = false

    async function handleFindBalances() {
        try {
            error = ''
            isBusy = true

            if ($isSoftwareProfile && $isStrongholdLocked) {
                await setStrongholdPassword(password)
            } else if ($isLedgerProfile && !isLedgerConnected()) {
                isBusy = false

                displayNotificationForLedgerProfile('warning')

                return
            }

            await asyncSyncAccounts(startAddressIndex, currentGapLimit, accountDiscoveryThreshold, false)

            previousGapLimit = currentGapLimit
            currentGapLimit += gapLimitIncrement
            previousAccountDiscoveryThreshold = accountDiscoveryThreshold++
            hasUsedBalanceFinder = true
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

    function handleCancelClick() {
        closePopup()
    }

    onDestroy(() => {
        // todo: (Jason) Remove this
        if (hasUsedBalanceFinder) {
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
        <!-- <KeyValueBox keyText={localize('popups.balanceFinder.a')} valueText={previousGapLimit} />  TODO: (Jason) Remove this -->
        <KeyValueBox
            keyText={localize('popups.walletFinder.accountsFound')}
            valueText={$activeAccounts.length || '0'}
        />
        <KeyValueBox
            keyText={localize('popups.walletFinder.totalWalletBalance')}
            valueText={$balanceOverview.balance}
        />
    </div>

    {#if false}
        <!-- TODO: (Jason) Use popups/Password.svelte to unlock -->
        <div class="flex w-full flex-row flex-wrap justify-between">
            <Text type="p" secondary classes="mb-3">{localize('popups.walletFinder.typePassword')}</Text>
            <Password
                {error}
                classes="w-full mb-2"
                bind:value={password}
                showRevealToggle
                placeholder={localize('general.password')}
                autofocus
                submitHandler={() => handleFindBalances()}
                disabled={isBusy}
            />
        </div>
    {/if}

    {#if hasUsedBalanceFinder}
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
    <Button
        classes="w-full"
        onClick={handleFindBalances}
        disabled={($isSoftwareProfile && $isStrongholdLocked && password.length === 0) || isBusy}
    >
        {#if isBusy}
            <Spinner busy={true} message={localize('actions.searching')} classes="justify-center" />
        {:else}{localize(`actions.${hasUsedBalanceFinder ? 'searchAgain' : 'searchBalances'}`)}{/if}
    </Button>
</div>
