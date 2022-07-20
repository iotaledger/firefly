<script lang="typescript">
    import { selectedAccount } from '@core/account'
    import { localize } from '@core/i18n'
    import { activeAccounts, visibleActiveAccounts } from '@core/profile'
    import { deleteAccount } from '@core/profile-manager'
    import { ACCOUNT_ACTIONS_ICONS } from '@lib/auxiliary/icon'
    import { openPopup } from '@lib/popup'
    import { HR, MenuItem, Modal, ToggleHiddenAccountMenuItem } from 'shared/components'

    export let modal: Modal

    const shouldDisableDelete = $selectedAccount.meta.index !== $activeAccounts?.length - 1

    const handleCustomiseAccountClick = () => {
        openPopup({ type: 'manageAccount' })
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

    function handleDeleteAccountClick(): void {
        openPopup({
            type: 'deleteAccount',
            props: {
                account: selectedAccount,
                hasMultipleAccounts: $visibleActiveAccounts?.length > 1,
                deleteAccount,
            },
        })
        modal.close()
    }
</script>

<Modal bind:this={modal} position={{ top: '52px', right: '24px' }}>
    <div class="flex flex-col">
        <MenuItem
            icon={ACCOUNT_ACTIONS_ICONS.StorageDepositBreakdown}
            title={localize('actions.viewStorageDeposit')}
            onClick={handleViewStorageDepositClick}
            first
        />
        <MenuItem
            icon={ACCOUNT_ACTIONS_ICONS.TransactionHistory}
            title={localize('actions.exportTransactionHistory')}
            onClick={handleExportTransactionHistoryClick}
            disabled
        />
        <MenuItem
            icon={ACCOUNT_ACTIONS_ICONS.Customize}
            title={localize('actions.customizeAcount')}
            onClick={handleCustomiseAccountClick}
        />
        <ToggleHiddenAccountMenuItem onClick={() => modal.close()} last />
        <HR />
        <MenuItem
            icon={ACCOUNT_ACTIONS_ICONS.Delete}
            title={localize('actions.deleteAccount')}
            onClick={handleDeleteAccountClick}
            first
            last
            disabled={shouldDisableDelete}
        />
    </div>
</Modal>
