<script lang="typescript">
    import { selectedAccount } from '@core/account'
    import { localize } from '@core/i18n'
    import { activeAccounts, visibleActiveAccounts } from '@core/profile'
    import { deleteAccount } from '@core/profile-manager'
    import { Icon } from '@lib/auxiliary/icon'
    import { openPopup } from '@lib/popup'
    import { HR, MenuItem, Modal, ToggleHiddenAccountMenuItem } from 'shared/components'

    export let modal: Modal

    const showDeleteAccount =
        $selectedAccount.getMetadata().index === $activeAccounts?.length - 1 && $visibleActiveAccounts?.length > 1

    const handleCustomiseAccountClick = () => {
        openPopup({ type: 'manageAccount' })
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
                deleteAccount,
            },
        })
        modal.close()
    }
</script>

<Modal bind:this={modal} position={{ top: '52px', right: '24px' }}>
    <div class="flex flex-col">
        <MenuItem
            icon={Icon.Doc}
            title={localize('actions.viewStorageDeposit')}
            onClick={handleViewStorageDepositClick}
        />
        <MenuItem
            icon={Icon.Customize}
            title={localize('actions.customizeAcount')}
            onClick={handleCustomiseAccountClick}
        />
        <ToggleHiddenAccountMenuItem onClick={() => modal.close()} />
        <HR />
        {#if showDeleteAccount}
            <MenuItem
                icon={Icon.Delete}
                title={localize('actions.deleteAccount')}
                onClick={handleDeleteAccountClick}
                variant="error"
            />
        {/if}
    </div>
</Modal>
