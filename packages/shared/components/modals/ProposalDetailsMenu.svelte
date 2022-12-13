<script lang="typescript">
    import { Icon } from '@auxiliary/icon'
    import { openPopup } from '@auxiliary/popup'
    import { localize } from '@core/i18n'
    import { Modal, MenuItem } from 'shared/components'

    export let modal: Modal = undefined

    function handleRemove(): void {
        openPopup({
            type: 'removeProposal',
        })
    }

    // TODO: User can only remove a proposal when he is not voting for it
</script>

<Modal bind:this={modal} {...$$restProps}>
    <div class="flex flex-col">
        <MenuItem
            icon={Icon.Delete}
            iconProps={{ width: '16', height: '19' }}
            title={localize('actions.removeProposal')}
            onClick={handleRemove}
        />
    </div>
</Modal>
