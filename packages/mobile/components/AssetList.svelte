<script lang="ts">
    import VirtualList from '@sveltejs/svelte-virtual-list'

    import { Filter, SearchInput } from '@components'
    import { AssetTile, Text } from '@ui'

    import { localize } from '@core/i18n'
    import { IAccountAssets, IAsset } from '@core/wallet'
    import { assetFilter } from '@core/wallet/stores'
    import { isVisibleAsset } from '@core/wallet/utils/isVisibleAsset'

    import { FilterType } from '@/contexts/wallet'

    export let assets: IAccountAssets
    export let onAssetTileClick: (asset: IAsset) => unknown = () => {}

    let searchValue = ''
    let assetList: IAsset[]
    $: $assetFilter, assets, (assetList = getFilteredAssetList()), scrollToTop()
    $: isEmptyBecauseOfFilter = (assets.baseCoin || assets.nativeTokens?.length > 0) && assetList.length === 0

    function scrollToTop(): void {
        const listElement = document.querySelector('.asset-list')?.querySelector('svelte-virtual-list-viewport')
        if (listElement) {
            listElement.scroll(0, 0)
        }
    }

    $: assets, searchValue, (assetList = getFilteredAssetList())

    function getFilteredAssetList(): IAsset[] {
        const list = []

        if (assets?.baseCoin) {
            list.push(assets.baseCoin)
        }
        list.push(...(assets?.nativeTokens ?? []))
        return searchAssets(
            list.filter((_nativeToken) => isVisibleAsset(_nativeToken)),
            searchValue
        )
    }

    function searchAssets(assets: IAsset[], searchValue: string): IAsset[] {
        const filteredAssets = assets?.filter((asset) => {
            if (!searchValue) {
                return true
            } else {
                const matchId = asset?.id?.toLowerCase().includes(searchValue.toLowerCase())

                const metadataKeys = ['name', 'description', 'unit']
                const matchMetadata = metadataKeys.some((key) => {
                    const hasMatch = asset?.metadata?.[key]?.toLowerCase().includes(searchValue.toLowerCase())
                    return hasMatch
                })

                return matchId || matchMetadata
            }
        })
        return filteredAssets
    }
</script>

{#if assets}
    <asset-list-container class="asset-list h-full flex flex-auto flex-col flex-grow shrink-0">
        <asset-list-header class="flex flex-row space-x-4 justify-between items-center sticky mb-4">
            <search-input-container class="block flex-1">
                <SearchInput bind:value={searchValue} />
            </search-input-container>
            <Filter filterStoreValue={$assetFilter} filterType={FilterType.Token} />
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
