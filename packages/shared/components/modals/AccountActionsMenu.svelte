<script lang="typescript">
    import { selectedAccount, setSelectedAccount } from '@core/account'
    import { localize } from '@core/i18n'
    import { removeLatestAccount } from '@core/profile-manager'
    import { activeAccounts, visibleActiveAccounts, removeAccountFromActiveAccounts } from '@core/profile'
    import { resetWalletRoute } from '@core/router'
    import { HR, Modal, MenuItem, ToggleHiddenAccountMenuItem } from 'shared/components'
    import { openPopup } from 'shared/lib/popup'
    import { SettingsIcons } from 'shared/lib/typings/icons'
    import { showAppNotification } from '@lib/notifications'

    export let modal: Modal

    const shouldDisableDelete = $selectedAccount.meta.index !== $activeAccounts?.length - 1

    const handleCustomiseAccountClick = () => {
        openPopup({
            type: 'manageAccount',
        })
        modal.close()
    }

    function handleExportTransactionHistoryClick() {
        openPopup({ type: 'exportTransactionHistory', props: { account: selectedAccount }, hideClose: false })
        modal.close()
    }

    function handleViewStorageDepositClick() {
        openPopup({ type: 'storageDepositBreakdown' })
        modal.close()
    }

    const handleDeleteAccountClick = () => {
        openPopup({
            type: 'deleteAccount',
            props: {
                account: selectedAccount,
                hasMultipleAccounts: $visibleActiveAccounts?.length > 1,
                deleteAccount: (id: string) => {
                    removeLatestAccount()
                        .then(() => {
                            removeAccountFromActiveAccounts(id)

                            setSelectedAccount($visibleActiveAccounts?.[0]?.id ?? null)
                            resetWalletRoute()
                        })
                        .catch((error) => {
                            showAppNotification({
                                type: 'error',
                                message: localize(error.type),
                            })
                        })
                },
            },
        })
        modal.close()
    }
</script>

<Modal bind:this={modal} position={{ top: '52px', right: '24px' }}>
    <div class="flex flex-col">
        <MenuItem
            icon={SettingsIcons.storageDepositBreakdown}
            title={localize('actions.viewStorageDeposit')}
            onClick={handleViewStorageDepositClick}
            first
        />
        <MenuItem
            icon={SettingsIcons.transactionHistory}
            title={localize('actions.exportTransactionHistory')}
            onClick={handleExportTransactionHistoryClick}
        />
        <MenuItem icon="customize" title={localize('actions.customizeAcount')} onClick={handleCustomiseAccountClick} />
        <ToggleHiddenAccountMenuItem onClick={() => modal.close()} last />
        <HR />
        <MenuItem
            icon="delete"
            title={localize('actions.deleteAccount')}
            onClick={handleDeleteAccountClick}
            first
            last
            disabled={shouldDisableDelete}
        />
    </div>
</Modal>
