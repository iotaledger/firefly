<script lang="typescript">
    import { Button, Password, Spinner, Text, TextHint } from 'shared/components'
    import { closePopup } from 'shared/lib/popup'
    import { setStrongholdPassword, asyncSyncAccounts } from 'shared/lib/wallet'
    import { isLedgerProfile, isSoftwareProfile, isStrongholdLocked } from 'shared/lib/profile'
    import { showAppNotification } from 'shared/lib/notifications'
    import { displayNotificationForLedgerProfile, isLedgerConnected } from 'shared/lib/ledger'
    import { localize } from '@core/i18n'
    import { cacheAllStakingPeriods, StakingAirdrop } from '@lib/participation'
    import { onDestroy } from 'svelte'
    import { activeProfile } from '@core/profile'

    const { balanceOverview, accounts } = $activeProfile

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
        if (hasUsedBalanceFinder) {
            cacheAllStakingPeriods(StakingAirdrop.Assembly)
            cacheAllStakingPeriods(StakingAirdrop.Shimmer)
        }
    })
</script>

<Text type="h4" classes="mb-2">{localize('popups.balanceFinder.title')}</Text>
<Text type="p" secondary classes="mb-4">{localize('popups.balanceFinder.body')}</Text>

<div class="flex w-full flex-row flex-wrap mb-4">
    <div class="flex w-full flex-row flex-wrap mb-1 justify-between">
        <Text type="p">{localize('popups.balanceFinder.accountsSearched')}</Text>
        <Text type="p" highlighted>{previousAccountDiscoveryThreshold}</Text>
    </div>
    <div class="flex w-full flex-row flex-wrap mb-1 justify-between">
        <Text type="p">{localize('popups.balanceFinder.addressesSearched')}</Text>
        <Text type="p" highlighted>{previousGapLimit}</Text>
    </div>
    <div class="flex w-full flex-row flex-wrap mb-1 justify-between">
        <Text type="p">{localize('popups.balanceFinder.accountsFound')}</Text>
        <Text type="p" highlighted>{$accounts.length}</Text>
    </div>
    <div class="flex w-full flex-row flex-wrap mb-1 justify-between">
        <Text type="p">{localize('popups.balanceFinder.totalWalletBalance')}</Text>
        <Text type="p" secondary>{$balanceOverview.balanceFiat}</Text>
        <Text type="p" highlighted>{$balanceOverview.balance}</Text>
    </div>
</div>

{#if $isSoftwareProfile && $isStrongholdLocked}
    <div class="flex w-full flex-row flex-wrap mb-4 justify-between">
        <Text type="p" secondary classes="mb-3">{localize('popups.balanceFinder.typePassword')}</Text>
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
        classes="p-4 w-full rounded-2xl bg-blue-50 dark:bg-gray-800 mb-4"
        icon="info"
        iconClasses="fill-current text-blue-500 dark:text-blue-500"
        hint={localize('popups.balanceFinder.searchAgainHint')}
        hintClasses="text-gray-500 dark:text-gray-500"
    />
{/if}

<div class="flex flex-row flex-nowrap w-full space-x-4">
    <Button classes="w-full" secondary onClick={handleCancelClick} disabled={isBusy}>
        {localize('actions.done')}
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
