<script lang="ts">
    import { IAsset } from '@core/wallet'
    import { Modal, AssetActionsModal, MeatballMenuButton } from 'shared/components'

    export let asset: IAsset

    let modal: Modal
</script>

<div class="max-h-7 max-w-9 flex-none flex-initial overflow-visible relative">
    <MeatballMenuButton onClick={modal?.toggle} />
    <AssetActionsModal bind:modal {asset} position={{ right: '0' }} classes="mt-1.5" />
</div>
