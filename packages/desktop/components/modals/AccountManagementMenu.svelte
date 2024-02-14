<script lang="ts">
    import { MenuItem, Modal } from '@ui'
    import { localize } from '@core/i18n'
    import { Icon } from '@auxiliary/icon/enums'
    import { updateActiveWalletPersistedData } from '@core/profile'
    import { selectedWalletId } from '@core/wallet'

    export let modal: Modal = undefined
    export let accountId: string
    function setAsMainAccount(): void {
        updateActiveWalletPersistedData($selectedWalletId, {
            mainAccountId: accountId,
        })
        modal?.close()
    }
</script>

<Modal bind:this={modal} {...$$restProps}>
    <account-management-menu class="flex flex-col">
        <MenuItem
            icon={Icon.Star}
            title={localize('views.accountManagement.details.modal.setMainAccount')}
            onClick={setAsMainAccount}
        />
    </account-management-menu>
</Modal>
