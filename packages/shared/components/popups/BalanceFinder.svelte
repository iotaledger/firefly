<script lang="typescript">
    import { Button, Password, Spinner, Text } from 'shared/components'
    import { closePopup } from 'shared/lib/popup'
    import { asyncSetStrongholdPassword, asyncSyncAccounts, wallet } from 'shared/lib/wallet'
    import { isLedgerProfile, isSoftwareProfile, isStrongholdLocked } from 'shared/lib/profile'
    import { showAppNotification } from 'shared/lib/notifications'
    import { displayNotificationForLedgerProfile, isLedgerConnected } from 'shared/lib/ledger'
    import { Locale } from 'shared/lib/typings/i18n'

    export let locale: Locale

    const { balanceOverview } = $wallet

    const addressIndex = 0
    const gapLimitIncrement = $isLedgerProfile ? 10 : 25
    let currentGapLimit = gapLimitIncrement
    let accountDiscoveryThreshold = $isLedgerProfile ? 3 : 10
    let password = ''
    let error = ''
    let isBusy = false

    async function handleFindBalances() {
        try {
            error = ''
            isBusy = true

            if ($isSoftwareProfile && $isStrongholdLocked) {
                await asyncSetStrongholdPassword(password)
            } else if ($isLedgerProfile && !isLedgerConnected()) {
                isBusy = false

                displayNotificationForLedgerProfile('warning')

                return
            }

            await asyncSyncAccounts(addressIndex, currentGapLimit, accountDiscoveryThreshold, false)

            currentGapLimit += gapLimitIncrement
            accountDiscoveryThreshold++
        } catch (err) {
            error = locale(err.error)

            if ($isLedgerProfile) {
                displayNotificationForLedgerProfile('error', true, true, false, false, err)
            } else {
                showAppNotification({
                    type: 'error',
                    message: locale(err.error),
                })
            }
        } finally {
            isBusy = false
        }
    }

    function handleCancelClick() {
        closePopup()
    }
</script>

<Text type="h4" classes="mb-6">{locale('popups.balanceFinder.title')}</Text>
<Text type="p" secondary classes="mb-5">{locale('popups.balanceFinder.body')}</Text>
<div class="flex w-full flex-row flex-wrap">
    <div class="flex w-full flex-row flex-wrap mb-1 justify-between">
        <Text type="p">{locale('popups.balanceFinder.totalWalletBalance')}</Text>
        <Text type="p" highlighted>{$balanceOverview.balance}</Text>
        <Text type="p" secondary>{$balanceOverview.balanceFiat}</Text>
    </div>
    <div class="flex w-full flex-row flex-wrap mt-4 mb-6 justify-between">
        {#if $isSoftwareProfile && $isStrongholdLocked}
            <Text type="p" secondary classes="mb-3">{locale('popups.balanceFinder.typePassword')}</Text>
            <Password
                {error}
                classes="w-full mb-2"
                bind:value={password}
                showRevealToggle
                {locale}
                placeholder={locale('general.password')}
                autofocus
                submitHandler={() => handleFindBalances()}
                disabled={isBusy}
            />
        {/if}
    </div>
    <div class="flex flex-row flex-nowrap w-full space-x-4">
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
            {:else}{locale(`actions.${addressIndex ? 'searchAgain' : 'searchBalances'}`)}{/if}
        </Button>
    </div>
</div>
