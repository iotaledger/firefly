<script lang="ts">
    import VirtualList from '@sveltejs/svelte-virtual-list'
    import { AssetTile, Text, TextType } from 'shared/components'
    import { Filter } from '../../../desktop/components' // TODO: refactor to match dependency platform
    import { localize } from '@core/i18n'
    import { assetFilter, IAccountAssets, IAsset } from '@core/wallet'
    import { isVisibleAsset } from '@core/wallet/utils/isVisibleAsset'
    import { openPopup, PopupId } from '@auxiliary/popup'

    export let assets: IAccountAssets

    let assetList: IAsset[]
    $: $assetFilter, assets, setFilteredAssetList(), scrollToTop()
    $: isEmptyBecauseOfFilter = (assets.baseCoin || assets.nativeTokens?.length > 0) && assetList.length === 0

    function setFilteredAssetList(): void {
        if (!assets) {
            assetList = []
        } else {
            assetList = [assets.baseCoin, ...assets.nativeTokens].filter(isVisibleAsset)
        }
    }

    function scrollToTop() {
        const listElement = document.querySelector('.asset-list')?.querySelector('svelte-virtual-list-viewport')
        if (listElement) {
            listElement.scroll(0, 0)
        }
    }

    function onAssetTileClick(asset: IAsset): void {
        openPopup({
            id: PopupId.TokenInformation,
            overflow: true,
            props: {
                asset,
            },
        })
    }
</script>

{#if assets}
    <div class="asset-list h-full p-6 flex flex-auto flex-col flex-grow shrink-0">
        <div class="w-full flex flex-row justify-between items-center mb-4">
            <Text classes="text-left" type={TextType.h5}>{localize('general.assets')}</Text>
            <Filter filterStore={assetFilter} />
        </div>
        <div class="flex-auto h-full pb-10">
            {#if assetList.length > 0}
                <VirtualList items={assetList} let:item>
                    <AssetTile classes="mb-2" onClick={() => onAssetTileClick(item)} asset={item} />
                </VirtualList>
            {:else}
                <div class="h-full flex flex-col items-center justify-center text-center">
                    <Text secondary
                        >{localize(`general.${isEmptyBecauseOfFilter ? 'noFilteredAsset' : 'noAssets'}`)}</Text
                    >
                </div>
            {/if}
        </div>
    </div>
{/if}

<style lang="scss">
    .asset-list :global(svelte-virtual-list-viewport) {
        margin-right: -1rem !important;
        flex: auto;
        overflow-y: scroll;
        padding-right: 1.5rem !important;
    }
    .asset-list :global(svelte-virtual-list-contents) {
        margin-right: -1rem !important;
    }
</style>
