<script lang="ts">
    import { localize } from '@core/i18n'
    import { IAccountAssets, IAsset } from '@core/wallet'
    import { assetFilter } from '@core/wallet/stores'
    import { isVisibleAsset } from '@core/wallet/utils/isVisibleAsset'
    import VirtualList from '@sveltejs/svelte-virtual-list'
    import { AssetTile, Text } from 'shared/components'
    import { Filter } from '../components'

    export let assets: IAccountAssets
    export let onAssetTileClick: (asset: IAsset) => unknown = () => {}

    let assetList: IAsset[]
    $: $assetFilter, assets, (assetList = getFilteredAssetList()), scrollToTop()
    $: isEmptyBecauseOfFilter = (assets.baseCoin || assets.nativeTokens?.length > 0) && assetList.length === 0

    function scrollToTop(): void {
        const listElement = document.querySelector('.asset-list')?.querySelector('svelte-virtual-list-viewport')
        if (listElement) {
            listElement.scroll(0, 0)
        }
    }

    function getFilteredAssetList(): IAsset[] {
        const list = []

        if (assets?.baseCoin) {
            list.push(assets.baseCoin)
        }
        list.push(...assets?.nativeTokens)
        return list.filter((_nativeToken) => isVisibleAsset(_nativeToken))
    }
</script>

{#if assets}
    <asset-list-container class="asset-list h-full flex flex-auto flex-col flex-grow flex-shrink-0">
        <asset-list-header class="sticky pb-4">
            <Filter filterStoreValue={$assetFilter} filterType="asset" />
        </asset-list-header>
        {#if assetList.length > 0}
            <VirtualList items={assetList} let:item>
                <AssetTile classes="mb-2" onClick={() => onAssetTileClick(item)} asset={item} />
            </VirtualList>
        {:else}
            <div class="h-full flex flex-col items-center justify-center text-center">
                <Text secondary>{localize(`general.${isEmptyBecauseOfFilter ? 'noFilteredAsset' : 'noAssets'}`)}</Text>
            </div>
        {/if}
    </asset-list-container>
{/if}
