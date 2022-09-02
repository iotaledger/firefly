<script lang="typescript">
    import {
        generateTransactionHistoryCsvFromAccount,
        generateTransactionHistoryFileName,
    } from 'shared/lib/transactionHistory'
    import { Button, PasswordInput, Spinner, Text } from 'shared/components'
    import { Platform } from 'shared/lib/platform'
    import { displayNotificationForLedgerProfile, ledgerDeviceStatus } from '@core/ledger'
    import { showAppNotification } from 'shared/lib/notifications'
    import { closePopup } from 'shared/lib/popup'
    import { activeProfile, isActiveLedgerProfile, isSoftwareProfile } from '@core/profile'
    import { localize } from '@core/i18n'
    import { setStrongholdPassword } from '@core/profile-manager'
    import { selectedAccount } from '@core/account'

    const profileName = $activeProfile?.name
    const { isStrongholdLocked } = $activeProfile

    let password = ''
    let error = ''
    let isBusy = false

    async function handleExportTransactionHistory() {
        try {
            error = ''
            isBusy = true

            if ($isSoftwareProfile && $isStrongholdLocked) {
                await setStrongholdPassword(password)
            } else if ($isActiveLedgerProfile && !$ledgerDeviceStatus.connected) {
                isBusy = false

                displayNotificationForLedgerProfile('warning')

                return
            }

            const fileName = generateTransactionHistoryFileName(profileName, $selectedAccount.getAlias())
            const contents = generateTransactionHistoryCsvFromAccount($selectedAccount, {
                id: true,
                internal: true,
                value: true,
                formattedValue: true,
                date: true,
                time: true,
            })
            try {
                const filePath = await Platform.exportTransactionHistory(fileName, contents)
                if (filePath) {
                    closePopup()
                    showAppNotification({
                        type: 'info',
                        message: localize('notifications.exportTransactionHistory.success', {
                            values: { accountAlias: $selectedAccount.getAlias(), filePath: filePath },
                        }),
                    })
                }
            } catch {
                showAppNotification({
                    type: 'error',
                    message: localize('notifications.exportTransactionHistory.error', {
                        values: { accountAlias: $selectedAccount.getAlias() },
                    }),
                })
            }

            isBusy = false
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

    function handleCancelClick() {
        closePopup()
    }
</script>

<Text type="h4" classes="mb-6">{localize('popups.exportTransactionHistory.title')}</Text>
<Text type="p" secondary classes="mb-5">{localize('popups.exportTransactionHistory.body')}</Text>
<div class="flex w-full flex-row flex-wrap">
    <div class="flex w-full flex-row flex-wrap mb-1 justify-between">
        <Text type="p">{localize('popups.exportTransactionHistory.profileName')}</Text>
        <Text type="p" highlighted>{profileName}</Text>
    </div>
    <div class="flex w-full flex-row flex-wrap mb-1 justify-between">
        <Text type="p">{localize('popups.exportTransactionHistory.accountName')}</Text>
        <Text type="p" highlighted>{$selectedAccount.getAlias()}</Text>
    </div>
    <div class="flex w-full flex-row flex-wrap mt-4 mb-6 justify-between">
        {#if $isSoftwareProfile && $isStrongholdLocked}
            <Text type="p" secondary classes="mb-3">{localize('popups.exportTransactionHistory.typePassword')}</Text>
            <PasswordInput
                {error}
                classes="w-full mb-2"
                bind:value={password}
                showRevealToggle
                placeholder={localize('general.password')}
                autofocus
                submitHandler={() => handleExportTransactionHistory()}
                disabled={isBusy}
            />
        {/if}
    </div>
    <div class="flex flex-row flex-nowrap w-full space-x-4">
        <Button classes="w-full" secondary onClick={handleCancelClick} disabled={isBusy}
            >{localize('actions.cancel')}</Button
        >
        <Button
            classes="w-full"
            onClick={handleExportTransactionHistory}
            disabled={($isSoftwareProfile && $isStrongholdLocked && password.length === 0) || isBusy}
        >
            {#if isBusy}
                <Spinner busy={true} message={localize('actions.exporting')} classes="justify-center" />
            {:else}{localize('actions.export')}{/if}
        </Button>
    </div>
</div>
