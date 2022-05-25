<script lang="typescript">
    import { selectedAccount, setSelectedAccount } from '@core/account'
    import { localize } from '@core/i18n'
    import { activeAccounts, visibleActiveAccounts } from '@core/profile'
    import { resetWalletRoute } from '@core/router'
    import { HR, Modal, MenuItem, ToggleHiddenAccountMenuItem } from 'shared/components'
    import { openPopup } from 'shared/lib/popup'
    import { SettingsIcons } from 'shared/lib/typings/icons'

    export let modal: Modal

    const canDelete =
        $selectedAccount.meta.index === $activeAccounts?.length - 1 &&
        Number($selectedAccount?.balances.total) === 0 &&
        $selectedAccount.messages?.length === 0

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
                    // TODO: Replace with new api when it is implemented
                    // await asyncRemoveWalletAccount($selectedAccount?.id)
                    // TODO: remove account from activeAccounts
                    setSelectedAccount($visibleActiveAccounts?.[0]?.id ?? null)
                    resetWalletRoute()
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
            disabled
        />
    </div>
</Modal>
