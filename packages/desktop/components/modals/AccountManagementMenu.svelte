<script lang="ts">
    import { MenuItem, Modal } from '@ui'
    import { localize } from '@core/i18n'
    import { Icon } from '@auxiliary/icon/enums'

    export let modal: Modal = undefined

    function setAsMainAccount(): void {
        // TODO: Add logic to set the account as the main account
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
