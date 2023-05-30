<script lang="ts">
    import VirtualList from '@sveltejs/svelte-virtual-list'

    import { Filter, SearchInput } from '@components'
    import { AssetTile, Text } from '@ui'

    import { localize } from '@core/i18n'
    import { AccountAssets, IAsset } from '@core/wallet'
    import { assetFilter } from '@core/wallet/stores'
    import { isVisibleAsset } from '@core/wallet/utils/isVisibleAsset'

    import { FilterType } from '@/contexts/wallet'

    export let assets: AccountAssets
    export let onAssetTileClick: (asset: IAsset) => unknown = () => {}

    let searchValue = ''

    let filteredAssetList: IAsset[]
    $: $assetFilter, assets, (filteredAssetList = getFilteredAssetList()), scrollToTop()

    let isEmptyBecauseOfFilter: boolean = false
    $: assets, (isEmptyBecauseOfFilter = getAssetList().length > 0 && filteredAssetList.length === 0)

    function scrollToTop(): void {
        const listElement = document.querySelector('.asset-list')?.querySelector('svelte-virtual-list-viewport')
        if (listElement) {
            listElement.scroll(0, 0)
        }
    }

    $: assets, searchValue, (filteredAssetList = getFilteredAssetList())

    function getFilteredAssetList(): IAsset[] {
        const list = getAssetList()
        return searchAssets(
            list.filter((_nativeToken) => isVisibleAsset(_nativeToken)),
            searchValue
        )
    }

    function getAssetList(): IAsset[] {
        const list = []
        for (const assetsPernetwork of Object.values(assets)) {
            if (assetsPernetwork?.baseCoin) {
                list.push(assetsPernetwork.baseCoin)
            }
            list.push(...(assetsPernetwork?.nativeTokens ?? []))
        }
        return list
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
    <asset-list-container class="asset-list h-full flex flex-auto flex-col flex-grow flex-shrink-0">
        <asset-list-header class="flex flex-row space-x-4 justify-between items-center sticky mb-4">
            <search-input-container class="block flex-1">
                <SearchInput bind:value={searchValue} />
            </search-input-container>
            <Filter filterStoreValue={$assetFilter} filterType={FilterType.Token} />
        </asset-list-header>
        {#if filteredAssetList.length > 0}
            <VirtualList items={filteredAssetList} let:item>
                <AssetTile classes="mb-2" onClick={() => onAssetTileClick(item)} asset={item} />
            </VirtualList>
        {:else}
            <div class="h-full flex flex-col items-center justify-center text-center">
                <Text secondary>{localize(`general.${isEmptyBecauseOfFilter ? 'noFilteredAsset' : 'noAssets'}`)}</Text>
            </div>
        {/if}
    </asset-list-container>
{/if}
