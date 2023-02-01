<script lang="ts">
    import { localize } from '@core/i18n'
    import { IAccountAssets, IAsset } from '@core/wallet'
    import VirtualList from '@sveltejs/svelte-virtual-list'
    import { AssetTile, Text } from 'shared/components'
    import { SearchInput } from '../components'

    export let assets: IAccountAssets
    export let onAssetTileClick: (asset: IAsset) => unknown = () => {}

    let searchValue = ''
    let assetList: IAsset[]
    $: assets, searchValue, (assetList = getFilteredAssetList())

    function getFilteredAssetList(): IAsset[] {
        const list = []

        if (assets?.baseCoin) {
            list.push(assets.baseCoin)
        }
        list.push(...assets?.nativeTokens)

        return searchAssets(list, searchValue)
    }

    function searchAssets(assets: IAsset[], searchValue: string): IAsset[] {
        const filteredAssets = assets?.filter((asset) => {
            if (!searchValue) {
                return true
            } else {
                const matchId = asset?.id?.toLowerCase().includes(searchValue.toLowerCase())

                const metadataProps = ['name', 'description', 'unit']
                const matchMetadata = metadataProps.some((prop) => {
                    const hasMatch = asset?.metadata?.[prop]?.toLowerCase().includes(searchValue.toLowerCase())
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
        <asset-list-header class="sticky pb-4">
            <SearchInput bind:value={searchValue} />
        </asset-list-header>
        {#if assetList.length > 0}
            <VirtualList items={assetList} let:item>
                <AssetTile classes="mb-2" onClick={() => onAssetTileClick(item)} asset={item} />
            </VirtualList>
        {:else}
            <div class="h-full flex flex-col items-center justify-center text-center">
                <Text secondary>{localize('general.noAssets')}</Text>
            </div>
        {/if}
    </asset-list-container>
{/if}
