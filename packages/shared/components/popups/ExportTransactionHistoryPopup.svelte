<script lang="typescript">
    import { generateTransactionHistoryCsvFromAccount } from 'shared/lib/transactionHistory'
    import { Button,Password,Spinner,Text } from 'shared/components'
    import { Electron } from 'shared/lib/electron'
    import { displayNotificationForLedgerProfile,isLedgerConnected } from 'shared/lib/ledger'
    import { showAppNotification } from 'shared/lib/notifications'
    import { closePopup } from 'shared/lib/popup'
    import { activeProfile,isLedgerProfile,isSoftwareProfile,isStrongholdLocked } from 'shared/lib/profile'
    import type { Locale } from 'shared/lib/typings/i18n'
    import { asyncSetStrongholdPassword,wallet } from 'shared/lib/wallet'
    import { get } from 'svelte/store'

    export let locale: Locale

    const { accounts } = $wallet
    const profileName = get(activeProfile)?.name

    let password = ''
    let error = ''
    let isBusy = false

    async function handleExportTransactionHistory() {
        try {
            error = ''
            isBusy = true

            if ($isSoftwareProfile && $isStrongholdLocked) {
                await asyncSetStrongholdPassword(password)
            } else if($isLedgerProfile && !isLedgerConnected()) {
                isBusy = false

                displayNotificationForLedgerProfile('warning')

                return
            }

            let csvPayloads = []
            $accounts.forEach((wallerAccount,index) => {
                csvPayloads.push(
                    {
                        alias: wallerAccount.alias,
                        contents: generateTransactionHistoryCsvFromAccount(wallerAccount)
                    }
                )
            })

            Electron.exportTransactionHistory('firefly-transaction-history',csvPayloads)
                    .then((result) => {
                        isBusy = false
                    })
                    .catch((error) => {
                        isBusy = false
                        console.error(error)
                    })
        } catch (err) {
            error = locale(err.error)

            if($isLedgerProfile) {
                displayNotificationForLedgerProfile('error', true, true, false, false, err)
            } else {
                showAppNotification({
                    type: 'error',
                    message: locale(err.error)
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

<Text type="h4" classes="mb-6">{locale('popups.exportTransactionHistory.title')}</Text>
<Text type="p" secondary classes="mb-5">{locale('popups.exportTransactionHistory.body')}</Text>
<div class="flex w-full flex-row flex-wrap">
    <div class="flex w-full flex-row flex-wrap mb-1 justify-between">
        <Text type="p">{locale('popups.exportTransactionHistory.profileName')}</Text>
        <Text type="p" highlighted>{profileName}</Text>
    </div>
    <div class="flex w-full flex-row flex-wrap mb-1 justify-between">
        <Text type="p">{locale('popups.exportTransactionHistory.numberOfAccounts')}</Text>
        <Text type="p" highlighted>{$accounts.length}</Text>
    </div>
    <div class="flex w-full flex-row flex-wrap mt-4 mb-6 justify-between">
        {#if $isSoftwareProfile && $isStrongholdLocked}
            <Text type="p" secondary classes="mb-3">{locale('popups.exportTransactionHistory.typePassword')}</Text>
            <Password
                {error}
                classes="w-full mb-2"
                bind:value={password}
                showRevealToggle
                {locale}
                placeholder={locale('general.password')}
                autofocus
                submitHandler={() => handleExportTransactionHistory()}
                disabled={isBusy} />
        {/if}
    </div>
    <div class="flex flex-row flex-nowrap w-full space-x-4">
        <Button classes="w-full" secondary onClick={handleCancelClick} disabled={isBusy}>{locale('actions.cancel')}</Button>
        <Button classes="w-full" onClick={handleExportTransactionHistory} disabled={($isSoftwareProfile && $isStrongholdLocked && password.length === 0) || isBusy}>
            {#if isBusy}
                <Spinner busy={true} message={locale('actions.exporting')} classes="justify-center" />
            {:else}{locale('actions.export')}{/if}
        </Button>
    </div>
</div>
