<script lang="typescript">
    import { IAsset } from '@core/wallet'
    import { Modal, AssetActionsMenu, MeatballMenuButton } from 'shared/components'

    export let asset: IAsset

    let modal: Modal
</script>

<div class="max-h-7 max-w-9 flex-none flex-initial overflow-visible">
    <MeatballMenuButton onClick={modal?.toggle} />
    <AssetActionsMenu bind:modal {asset} />
</div>
