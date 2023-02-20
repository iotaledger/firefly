<script lang="ts">
    import { selectedAccount } from '@core/account/stores'
    import { localize } from '@core/i18n'
    import { activeAccounts, visibleActiveAccounts } from '@core/profile/stores'
    import { deleteAccount } from '@core/profile-manager/actions'
    import { Icon } from '@lib/auxiliary/icon/enums'
    import { openPopup } from '@auxiliary/popup/actions'
    import { HR, MenuItem, Modal, ToggleHiddenAccountMenuItem } from 'shared/components'

    export let modal: Modal = undefined

    const showDeleteAccount =
        $selectedAccount?.index === $activeAccounts?.length - 1 && $visibleActiveAccounts?.length > 1

    function handleCustomiseAccountClick(): void {
        openPopup({ id: 'manageAccount' })
        modal.close()
    }

    function handleViewBalanceClick(): void {
        openPopup({ id: 'balanceBreakdown' })
        modal.close()
    }

    function handleDeleteAccountClick(): void {
        openPopup({
            id: 'deleteAccount',
            props: {
                account: selectedAccount,
                deleteAccount,
            },
        })
        modal.close()
    }
</script>

<Modal bind:this={modal} {...$$restProps}>
    <div class="flex flex-col">
        <MenuItem icon={Icon.Doc} title={localize('actions.viewBalanceBreakdown')} onClick={handleViewBalanceClick} />
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
