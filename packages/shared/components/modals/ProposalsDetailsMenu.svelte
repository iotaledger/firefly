<script lang="typescript">
    import { Icon } from '@auxiliary/icon'
    import { openPopup } from '@auxiliary/popup'
    import { localize } from '@core/i18n'
    import { Modal, MenuItem } from 'shared/components'

    export let modal: Modal

    function handleRegister(): void {
        openPopup({
            type: 'registerProposal',
        })
    }
</script>

<Modal bind:this={modal} {...$$restProps}>
    <div class="flex flex-col">
        <MenuItem
            icon={Icon.Plus}
            iconProps={{ width: '14', height: '14' }}
            title={localize('actions.registerProposal')}
            onClick={handleRegister}
        />
    </div>
</Modal>
