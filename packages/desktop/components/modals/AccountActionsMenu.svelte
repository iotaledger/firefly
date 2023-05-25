<script lang="ts">
    import { HR, MenuItem, Modal, ToggleHiddenAccountMenuItem } from '@ui'

    import { selectedAccount } from '@core/account/stores'
    import { localize } from '@core/i18n'
    import { activeAccounts, visibleActiveAccounts } from '@core/profile/stores'
    import { deleteAccount } from '@core/profile-manager/actions'

    import { Icon } from '@auxiliary/icon/enums'
    import { PopupId } from '@auxiliary/popup'
    import { openOverlay } from '@auxiliary/popup/actions'

    export let modal: Modal = undefined

    const showDeleteAccount =
        $selectedAccount?.index === $activeAccounts?.length - 1 && $visibleActiveAccounts?.length > 1

    function onCustomiseAccountClick(): void {
        openOverlay({ id: PopupId.ManageAccount })
        modal?.close()
    }

    function onViewBalanceClick(): void {
        openOverlay({ id: PopupId.BalanceBreakdown })
        modal?.close()
    }

    function onDeleteAccountClick(): void {
        openOverlay({
            id: PopupId.DeleteAccount,
            props: {
                account: selectedAccount,
                deleteAccount,
            },
        })
        modal?.close()
    }
</script>

<Modal bind:this={modal} {...$$restProps}>
    <account-actions-menu class="flex flex-col">
        <MenuItem icon={Icon.Doc} title={localize('actions.viewBalanceBreakdown')} onClick={onViewBalanceClick} />
        <MenuItem icon={Icon.Customize} title={localize('actions.customizeAcount')} onClick={onCustomiseAccountClick} />
        <ToggleHiddenAccountMenuItem onClick={modal?.close} />
        <HR />
        {#if showDeleteAccount}
            <MenuItem
                icon={Icon.Delete}
                title={localize('actions.deleteAccount')}
                onClick={onDeleteAccountClick}
                variant="error"
            />
        {/if}
    </account-actions-menu>
</Modal>
