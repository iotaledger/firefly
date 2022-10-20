<script lang="typescript">
    import { localize } from '@core/i18n'
    import { IAccountAssets, IAsset } from '@core/wallet'
    import VirtualList from '@sveltejs/svelte-virtual-list'
    import { AssetTile, Text } from 'shared/components'

    export let assets: IAccountAssets

    let assetList: IAsset[]
    $: assets, (assetList = getAssetList())

    function getAssetList(): IAsset[] {
        const list = []

        if (assets?.baseCoin) {
            list.push(assets.baseCoin)
        }
        list.push(...assets?.nativeTokens)
        return list
    }
</script>

{#if assets}
    <div class="asset-list h-full flex flex-auto flex-col flex-grow flex-shrink-0">
        {#if assetList.length > 0}
            <VirtualList items={assetList} let:item>
                <AssetTile classes="mb-2" onClick={() => {}} asset={item} />
            </VirtualList>
        {:else}
            <div class="h-full flex flex-col items-center justify-center text-center">
                <Text secondary>{localize('general.noAssets')}</Text>
            </div>
        {/if}
    </div>
{/if}
