<script lang="typescript">
    import { Button, Password, Spinner, Text } from 'shared/components'
    import { closePopup } from 'shared/lib/popup'
    import { asyncSetStrongholdPassword, asyncSyncAccounts, wallet } from 'shared/lib/wallet'
    import { isLedgerProfile, isSoftwareProfile, isStrongholdLocked } from 'shared/lib/profile'
    import { ledgerDeviceState } from 'shared/lib/ledger'
    import { LedgerDeviceState } from 'shared/lib/typings/ledger'
    import { isNewNotification, showAppNotification } from 'shared/lib/notifications'

    export let locale

    const { balanceOverview } = $wallet

    let addressIndex = 0
    let gapIndex = 25
    let accountDiscoveryThreshold = 10
    let password = ''
    let error = ''
    let isBusy = false

    async function handleFindBalances() {
        try {
            error = ''
            isBusy = true

            if ($isSoftwareProfile && $isStrongholdLocked) {
                await asyncSetStrongholdPassword(password)
            }

            const _onFindBalances = async () => {
                await asyncSyncAccounts(addressIndex, gapIndex, accountDiscoveryThreshold, false)

                addressIndex += gapIndex
            }

            if($isLedgerProfile) {
                if($ledgerDeviceState === LedgerDeviceState.Connected) {
                    await _onFindBalances()
                }
                else {
                    if(isNewNotification('error'))
                        showAppNotification({
                            type: 'error',
                            message: locale(`error.ledger.${$ledgerDeviceState}`)
                        })
                }
            } else {
                await _onFindBalances()
            }
        } catch (err) {
            error = locale(err.error)

            showAppNotification({
                type: 'error',
                message: locale(err.error)
            })
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
                disabled={isBusy} />
        {/if}
    </div>
    <div class="flex flex-row flex-nowrap w-full space-x-4">
        <Button classes="w-full" secondary onClick={handleCancelClick} disabled={isBusy}>{locale('actions.cancel')}</Button>
        <Button classes="w-full" onClick={handleFindBalances} disabled={($isSoftwareProfile && $isStrongholdLocked && password.length === 0) || isBusy}>
            {#if isBusy}
                <Spinner busy={true} message={locale(`actions.searching`)} classes="justify-center" />
            {:else}{locale(`actions.${addressIndex ? 'searchAgain' : 'searchBalances'}`)}{/if}
        </Button>
    </div>
</div>
