<script lang="typescript">
    import { get } from 'svelte/store'

    import { Button, Password, Spinner, Text } from 'shared/components'

    import { localize } from '@core/i18n'
    import { accountRouter, AccountRoute } from '@core/router'

    import { displayNotificationForLedgerProfile, isLedgerConnected } from '@lib/ledger'
    import { showAppNotification } from '@lib/notifications'
    import { Platform } from '@lib/platform'
    import { activeProfile, isLedgerProfile, isSoftwareProfile, isStrongholdLocked } from '@lib/profile'
    import {
        generateTransactionHistoryCsvFromAccount,
        generateTransactionHistoryFileName,
    } from '@lib/transactionHistory'
    import { WalletAccount } from '@lib/typings/wallet'
    import { asyncSetStrongholdPassword } from '@lib/wallet'

    export let account: WalletAccount

    const profileName = get(activeProfile)?.name

    let password = ''
    let error = ''
    let isBusy = false

    async function handleExportTransactionHistory(): Promise<void> {
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

            const fileName = generateTransactionHistoryFileName(profileName, account.alias)
            const contents = generateTransactionHistoryCsvFromAccount(account, {
                id: true,
                internal: true,
                value: true,
                formattedValue: true,
                date: true,
                time: true,
            })

            await saveTransactionHistoryExport(fileName, contents)

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

    async function saveTransactionHistoryExport(fileName: string, contents: string): Promise<void> {
        try {
            const filePath = await Platform.exportTransactionHistory(fileName, contents)
            if (filePath) {
                $accountRouter.goTo(AccountRoute.Init)
                showAppNotification({
                    type: 'info',
                    message: localize('notifications.exportTransactionHistory.success', {
                        values: { accountAlias: account.alias, filePath: filePath },
                    }),
                })
            }
        } catch {
            showAppNotification({
                type: 'error',
                message: localize('notifications.exportTransactionHistory.error', {
                    value: { accountAlias: account.alias },
                }),
            })
        }
    }

    function handleCancelClick(): void {
        $accountRouter.goTo(AccountRoute.Init)
    }
</script>

<div class="safe-area flex flex-col p-5 pt-6">
    <div class="flex flex-row justify-center mb-6">
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
            <Text type="p" highlighted>{account.alias}</Text>
        </div>
        <div class="flex w-full flex-row flex-wrap mt-4 mb-6 justify-between">
            {#if $isSoftwareProfile && $isStrongholdLocked}
                <Text type="p" secondary classes="mb-3">
                    {localize('popups.exportTransactionHistory.typePassword')}
                </Text>
                <Password
                    {error}
                    classes="w-full mb-2"
                    bind:value={password}
                    showRevealToggle
                    {localize}
                    placeholder={localize('general.password')}
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
