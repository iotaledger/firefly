<script lang="ts">
    import VirtualList from '@sveltejs/svelte-virtual-list'
    import { AssetTile, Text, TextType } from 'shared/components'
    import { Filter } from '../../desktop/components'
    import { localize } from '@core/i18n'
    import { assetFilter, WalletAssets, IAsset } from '@core/wallet'
    import { isVisibleAsset } from '@core/wallet/utils/isVisibleAsset'
    import { openPopup, PopupId } from '@auxiliary/popup'

    export let assets: WalletAssets

    let filteredAssetList: IAsset[]
    let isEmptyBecauseOfFilter: boolean = false

    $: $assetFilter, assets, (filteredAssetList = getFilteredAssetList()), scrollToTop()
    $: assets, (isEmptyBecauseOfFilter = getAssetList().length > 0 && filteredAssetList.length === 0)

    function getFilteredAssetList(): IAsset[] {
        const list = getAssetList()
        return list.filter((_nativeToken) => isVisibleAsset(_nativeToken))
    }

    function getAssetList(): IAsset[] {
        const list = []
        for (const assetsPernetwork of Object.values(assets)) {
            if (assetsPernetwork?.baseCoin) {
                list.push(assetsPernetwork.baseCoin)
            }
            if (assetsPernetwork?.mana) {
                list.push(assetsPernetwork.mana)
            }
            list.push(...(assetsPernetwork?.nativeTokens ?? []))
        }
        return list
    }

    function scrollToTop(): void {
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
    <div class="asset-list h-full flex flex-auto flex-col flex-grow shrink-0">
        <div class="w-full flex flex-row justify-between items-center mb-4">
            <Text classes="text-left" type={TextType.h5}>{localize('general.assets')}</Text>
            <Filter filterStore={assetFilter} />
        </div>
        <div class="flex-auto h-full pb-10">
            {#if filteredAssetList.length > 0}
                <VirtualList items={filteredAssetList} let:item>
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
