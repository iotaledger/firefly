<script lang="typescript">
    import { Modal, MenuItem } from 'shared/components'

    export let modal: Modal
</script>

<Modal bind:this={modal} position={{ top: '100px', right: '60px' }}>
    <div class="flex flex-col">
        <MenuItem icon="receive" title="Download" first />
        <MenuItem icon="profile" title="Set NFT as profile avatar" />
        <MenuItem icon="export" title="View in IPFS" />
        <MenuItem icon="delete" title="Burn NFT" />
    </div>
</Modal>
