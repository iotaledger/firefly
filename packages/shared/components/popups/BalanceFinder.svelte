<script lang="typescript">
    import { Button, Spinner, Text } from 'shared/components'
    import { showAppNotification } from 'shared/lib/notifications'
    import { closePopup } from 'shared/lib/popup'
    import { asyncSyncAccounts, updateAccounts, wallet } from 'shared/lib/wallet'

    export let locale

    const { balanceOverview } = $wallet

    let addressIndex = 0
    let gapIndex = 50
    let isBusy = false

    async function handleFindBalances() {
        try {
            isBusy = true
            const syncedAccounts = await asyncSyncAccounts(addressIndex, gapIndex)
            updateAccounts(syncedAccounts)
            addressIndex += gapIndex
        } catch (err) {
            showAppNotification({
                type: 'error',
                message: locale(err.error),
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
    <div class="flex w-full flex-row flex-wrap mb-6 justify-between">
        <Text type="p">{locale('popups.balanceFinder.totalWalletBalance')}</Text>
        <Text type="p" highlighted>{$balanceOverview.balance}</Text>
        <Text type="p" secondary>{$balanceOverview.balanceFiat}</Text>
    </div>
    <div class="flex flex-row flex-nowrap w-full space-x-4">
        <Button classes="w-full" secondary onClick={handleCancelClick} disabled={isBusy}>{locale('actions.cancel')}</Button>
        <Button classes="w-full" onClick={handleFindBalances} disabled={isBusy}>
            {#if isBusy}
                <Spinner
                    busy={true}
                    message={locale(`actions.searching`)}
                    classes="justify-center" />
            {:else}{locale(`actions.${addressIndex ? 'searchAgain' : 'searchBalances'}`)}{/if}
        </Button>
    </div>
</div>
