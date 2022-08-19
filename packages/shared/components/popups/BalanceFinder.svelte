<script lang="typescript">
    import { onDestroy } from 'svelte'
    import { Button, Password, Spinner, Text, TextHint } from 'shared/components'
    import { Locale } from '@core/i18n'
    import { displayErrorEventToUser } from '@lib/errors'
    import { displayNotificationForLedgerProfile, isLedgerConnected } from '@lib/ledger'
    import { cacheAllStakingPeriods, StakingAirdrop } from '@lib/participation'
    import { closePopup } from '@lib/popup'
    import { isLedgerProfile, isSoftwareProfile, isStrongholdLocked } from '@lib/profile'
    import {
        asyncSetStrongholdPassword,
        asyncSyncAccounts,
        currentSyncingAccountStore,
        isSyncing,
        wallet,
    } from '@lib/wallet'
    import { mobile, isKeyboardOpened, keyboardHeight } from 'shared/lib/app'

    export let locale: Locale

    const { balanceOverview, accounts } = $wallet

    const startAddressIndex = 0
    const gapLimitIncrement = $isLedgerProfile ? 10 : 25
    let previousGapLimit = 0
    let currentGapLimit = gapLimitIncrement
    let previousAccountDiscoveryThreshold = 0
    let accountDiscoveryThreshold = $isLedgerProfile ? 3 : 10
    let password = ''
    let error = ''
    let isBusy = $isSyncing || $currentSyncingAccountStore !== null
    let hasUsedBalanceFinder = false

    $: if (isBusy && !$isSyncing && $currentSyncingAccountStore === null) {
        isBusy = false
        hasUsedBalanceFinder = true
    }

    async function handleFindBalances() {
        try {
            error = ''

            if ($isSoftwareProfile && $isStrongholdLocked) {
                await asyncSetStrongholdPassword(password)
            } else if ($isLedgerProfile && !isLedgerConnected()) {
                isBusy = false

                displayNotificationForLedgerProfile('warning')

                return
            }

            isBusy = true
            await asyncSyncAccounts(startAddressIndex, currentGapLimit, accountDiscoveryThreshold, false)

            previousGapLimit = currentGapLimit
            currentGapLimit += gapLimitIncrement
            previousAccountDiscoveryThreshold = accountDiscoveryThreshold++
            hasUsedBalanceFinder = true
        } catch (err) {
            error = locale(err.error)

            displayErrorEventToUser(err)
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

<Text type="h4" classes="mb-2 {$mobile && 'text-center -mt-4'}">{locale('popups.balanceFinder.title')}</Text>
<Text type="p" secondary classes="mb-4">{locale('popups.balanceFinder.body')}</Text>

<div class="flex w-full flex-row flex-wrap mb-4">
    <div class="flex w-full flex-row flex-wrap mb-1 justify-between">
        <Text type="p">{locale('popups.balanceFinder.accountsSearched')}</Text>
        <Text type="p" highlighted>{previousAccountDiscoveryThreshold}</Text>
    </div>
    <div class="flex w-full flex-row flex-wrap mb-1 justify-between">
        <Text type="p">{locale('popups.balanceFinder.addressesSearched')}</Text>
        <Text type="p" highlighted>{previousGapLimit}</Text>
    </div>
    <div class="flex w-full flex-row flex-wrap mb-1 justify-between">
        <Text type="p">{locale('popups.balanceFinder.accountsFound')}</Text>
        <Text type="p" highlighted>{$accounts.length}</Text>
    </div>
    <div class="flex w-full flex-row flex-wrap mb-1 justify-between">
        <Text type="p">{locale('popups.balanceFinder.totalWalletBalance')}</Text>
        <Text type="p" secondary>{$balanceOverview.balanceFiat}</Text>
        <Text type="p" highlighted>{$balanceOverview.balance}</Text>
    </div>
</div>

{#if $isSoftwareProfile && $isStrongholdLocked}
    <div class="flex w-full flex-row flex-wrap mb-4 justify-between">
        <Text type="p" secondary classes="mb-3">{locale('popups.balanceFinder.typePassword')}</Text>
        <Password
            {error}
            classes="w-full mb-2"
            bind:value={password}
            showRevealToggle
            {locale}
            placeholder={locale('general.password')}
            autofocus={!$mobile}
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
        hint={locale('popups.balanceFinder.searchAgainHint')}
        hintClasses="text-gray-500 dark:text-gray-500"
    />
{/if}

<div
    class="flex flex-row flex-nowrap w-full space-x-4"
    style="padding-bottom: {$mobile && $isKeyboardOpened
        ? $keyboardHeight
        : 0}px; transition: padding-bottom 0.2s var(--transition-scroll)"
>
    <Button classes="w-full" secondary onClick={handleCancelClick} disabled={isBusy}>
        {locale('actions.done')}
    </Button>
    <Button
        classes="w-full"
        onClick={handleFindBalances}
        disabled={($isSoftwareProfile && $isStrongholdLocked && password.length === 0) || isBusy}
    >
        {#if isBusy}
            <Spinner busy={true} message={locale('actions.searching')} classes="justify-center" />
        {:else}{locale(`actions.${hasUsedBalanceFinder ? 'searchAgain' : 'searchBalances'}`)}{/if}
    </Button>
</div>
