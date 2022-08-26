<script lang="typescript">
    import { localize } from '@core/i18n'
    import { mobile, isKeyboardOpened, keyboardHeight, getKeyboardTransitionSpeed } from 'shared/lib/app'
    import { Button, Password, Spinner, Text } from 'shared/components'
    import { displayNotificationForLedgerProfile, isLedgerConnected } from 'shared/lib/ledger'
    import { showAppNotification } from 'shared/lib/notifications'
    import { Platform } from 'shared/lib/platform'
    import { closePopup } from 'shared/lib/popup'
    import { activeProfile, isLedgerProfile, isSoftwareProfile, isStrongholdLocked } from 'shared/lib/profile'
    import {
        generateTransactionHistoryCsvFromAccount,
        generateTransactionHistoryFileName,
    } from 'shared/lib/transactionHistory'
    import { WalletAccount } from 'shared/lib/typings/wallet'
    import { asyncSetStrongholdPassword } from 'shared/lib/wallet'
    import { get, Readable } from 'svelte/store'

    export let account: Readable<WalletAccount>

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
            } else if ($isLedgerProfile && !isLedgerConnected()) {
                isBusy = false

                displayNotificationForLedgerProfile('warning')

                return
            }

            const fileName = generateTransactionHistoryFileName(profileName, $account.alias)
            const contents = generateTransactionHistoryCsvFromAccount($account, {
                id: true,
                internal: true,
                value: true,
                formattedValue: true,
                date: true,
                time: true,
            })
            try {
                const filePath = await Platform.exportTransactionHistory(contents, fileName)
                if (filePath) {
                    closePopup()
                    showAppNotification({
                        type: 'info',
                        message: localize('notifications.exportTransactionHistory.success', {
                            values: { accountAlias: $account.alias, filePath: filePath },
                        }),
                    })
                }
            } catch {
                showAppNotification({
                    type: 'error',
                    message: localize('notifications.exportTransactionHistory.error', {
                        value: { accountAlias: $account.alias },
                    }),
                })
            }

            isBusy = false
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
</script>

<div
    class="flex flex-col {$mobile ? 'safe-area px-2' : 'px-6 py-10'}"
    style="padding-bottom: {$mobile && $isKeyboardOpened
        ? $keyboardHeight - 20
        : 0}px; transition: padding-bottom {getKeyboardTransitionSpeed($isKeyboardOpened) +
        'ms'} var(--transition-scroll)"
>
    <div class="{$mobile ? 'flex flex-row justify-center' : ''} mb-6">
        <Text type="h4">{localize('popups.exportTransactionHistory.title')}</Text>
    </div>
    <Text type="p" secondary classes="mb-5">{localize('popups.exportTransactionHistory.body')}</Text>
    <div class="flex w-full flex-row flex-wrap">
        <div class="flex w-full flex-row flex-wrap mb-1 justify-between">
            <Text type="p">{localize('popups.exportTransactionHistory.profileName')}</Text>
            <Text type="p" highlighted>{profileName}</Text>
        </div>
        <div class="flex w-full flex-row flex-wrap mb-1 justify-between">
            <Text type="p">{localize('popups.exportTransactionHistory.accountName')}</Text>
            <Text type="p" highlighted>{$account.alias}</Text>
        </div>
        <div class="flex w-full flex-row flex-wrap mt-4 mb-6 justify-between">
            {#if $isSoftwareProfile && $isStrongholdLocked}
                <Text type="p" secondary classes="mb-3">{localize('popups.exportTransactionHistory.typePassword')}</Text
                >
                <Password
                    {error}
                    classes="w-full mb-2"
                    bind:value={password}
                    showRevealToggle
                    locale={localize}
                    placeholder={localize('general.password')}
                    autofocus
                    submitHandler={() => handleExportTransactionHistory()}
                    disabled={isBusy}
                />
            {/if}
        </div>
        <div class="flex flex-row flex-nowrap w-full space-x-4">
            <Button classes="w-full" secondary onClick={handleCancelClick} disabled={isBusy}>
                {localize('actions.cancel')}
            </Button>
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
</div>

<style>
    .safe-area {
        margin-bottom: calc(env(safe-area-inset-top) / 2);
    }
</style>
