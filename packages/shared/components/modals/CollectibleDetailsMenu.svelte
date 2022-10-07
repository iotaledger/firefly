<script lang="typescript">
    import { Modal, MenuItem } from 'shared/components'
    import { localize } from '@core/i18n'

    export let modal: Modal
</script>

<Modal bind:this={modal} position={{ top: '100px', right: '60px' }}>
    <div class="flex flex-col">
        <MenuItem icon="receive" title={localize('views.collectibles.details.menu.download')} first />
        <MenuItem icon="profile" title={localize('views.collectibles.details.menu.setAvatar')} />
        <MenuItem icon="export" title={localize('views.collectibles.details.menu.view')} />
        <MenuItem icon="delete" title={localize('views.collectibles.details.menu.burn')} />
    </div>
</Modal>
