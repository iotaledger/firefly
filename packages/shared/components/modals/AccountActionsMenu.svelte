<script lang="ts">
    import { selectedAccount } from '@core/account/stores'
    import { localize } from '@core/i18n'
    import { activeAccounts, visibleActiveAccounts } from '@core/profile/stores'
    import { deleteAccount } from '@core/profile-manager/actions'
    import { Icon } from '@lib/auxiliary/icon/enums'
    import { openPopup } from '@auxiliary/popup/actions'
    import { HR, MenuItem, Modal, ToggleHiddenAccountMenuItem } from 'shared/components'
    import { PopupId } from '@auxiliary/popup'

    export let modal: Modal = undefined

    const showDeleteAccount =
        $selectedAccount?.index === $activeAccounts?.length - 1 && $visibleActiveAccounts?.length > 1

    function onCustomiseAccountClick(): void {
        openPopup({ id: PopupId.ManageAccount })
        modal.close()
    }

    function onViewBalanceClick(): void {
        openPopup({ id: PopupId.BalanceBreakdown })
        modal.close()
    }

    function onDeleteAccountClick(): void {
        openPopup({
            id: PopupId.DeleteAccount,
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
        <MenuItem icon={Icon.Doc} title={localize('actions.viewBalanceBreakdown')} onClick={onViewBalanceClick} />
        <MenuItem icon={Icon.Customize} title={localize('actions.customizeAcount')} onClick={onCustomiseAccountClick} />
        <ToggleHiddenAccountMenuItem onClick={() => modal.close()} />
        <HR />
        {#if showDeleteAccount}
            <MenuItem
                icon={Icon.Delete}
                title={localize('actions.deleteAccount')}
                onClick={onDeleteAccountClick}
                variant="error"
            />
        {/if}
    </div>
</Modal>
