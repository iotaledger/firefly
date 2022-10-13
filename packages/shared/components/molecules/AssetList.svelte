<script lang="typescript">
    import { localize } from '@core/i18n'
    import { assetFilter, IAccountAssets, IAsset } from '@core/wallet'
    import { isVisibleAsset } from '@core/wallet/utils/isVisibleAsset'
    import { openPopup } from '@lib/popup'
    import VirtualList from '@sveltejs/svelte-virtual-list'
    import { AssetTile, Text, Filter, TextType } from 'shared/components'

    export let assets: IAccountAssets

    let assetList: IAsset[]
    $: $assetFilter, assets, (assetList = getFilteredAssetList()), scrollToTop()
    $: isEmptyBecauseOfFilter = (assets.baseCoin || assets.nativeTokens?.length > 0) && assetList.length === 0

    function getFilteredAssetList(): IAsset[] {
        const list = []

        if (assets?.baseCoin) {
            list.push(assets.baseCoin)
        }
        list.push(...assets?.nativeTokens)
        return list.filter((_nativeToken) => isVisibleAsset(_nativeToken))
    }

    function scrollToTop() {
        const listElement = document.querySelector('.asset-list')?.querySelector('svelte-virtual-list-viewport')
        if (listElement) {
            listElement.scroll(0, 0)
        }
    }

    function handleAssetTileClick(asset: IAsset): void {
        openPopup({
            type: 'tokenInformation',
            overflow: true,
            props: {
                asset,
            },
        })
    }
</script>

{#if assets}
    <div class="asset-list h-full p-6 flex flex-auto flex-col flex-grow flex-shrink-0">
        <div class="w-full flex flex-row justify-between items-center mb-4">
            <Text classes="text-left" type={TextType.h5}>{localize('general.assets')}</Text>
            <Filter filterStore={assetFilter} />
        </div>
        <div class="flex-auto h-full pb-10">
            {#if assetList.length > 0}
                <VirtualList items={assetList} let:item>
                    <AssetTile classes="mb-2" onClick={() => handleAssetTileClick(item)} asset={item} />
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
