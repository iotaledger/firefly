<script lang="typescript">
    import { localize } from '@core/i18n'
    import { assetFilter, IAccountAssets, IAsset } from '@core/wallet'
    import { isFilteredAsset } from '@core/wallet/utils/isFilteredAsset'
    import { openPopup } from '@lib/popup'
    import VirtualList from '@sveltejs/svelte-virtual-list'
    import { AssetTile, Text, Filter } from 'shared/components'
    import { TextType } from 'shared/components/Text.svelte'

    export let assets: IAccountAssets

    let assetList: IAsset[]
    $: $assetFilter, assets, updateFilteredAssetList()

    function updateFilteredAssetList() {
        const list = []
        if (assets?.baseCoin && !isFilteredAsset(assets?.baseCoin)) {
            list.push(assets.baseCoin)
        }
        list.push(...assets?.nativeTokens.filter((_nativeToken) => !isFilteredAsset(_nativeToken)))
        assetList = list
    }

    function handleAssetTileClick(asset): void {
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
        <div class="flex-auto h-full scroll-secondary pb-10">
            {#if assets?.baseCoin || assets?.nativeTokens?.length > 0}
                <VirtualList items={assetList} let:item>
                    <AssetTile classes="mb-2" onClick={() => handleAssetTileClick(item)} asset={item} />
                </VirtualList>
            {:else}
                <div class="h-full flex flex-col items-center justify-center text-center">
                    <Text secondary>{localize('general.noAssets')}</Text>
                </div>
            {/if}
        </div>
    </div>
{/if}

<style lang="scss">
    .asset-list :global(svelte-virtual-list-viewport) {
        margin-right: -1.25rem !important;
        flex: auto;
        overflow-y: scroll;
        padding-right: 1rem !important;
    }
    .asset-list :global(svelte-virtual-list-contents) {
        margin-right: -1rem !important;
    }
</style>
