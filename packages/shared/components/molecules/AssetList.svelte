<script lang="typescript">
    import { localize } from '@core/i18n'
    import { assetFilter, IAccountAssets } from '@core/wallet'
    import { openPopup } from '@lib/popup'
    import { AssetTile, Text, Filter } from 'shared/components'
    import { TextType } from 'shared/components/Text.svelte'

    export let assets: IAccountAssets

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
    <div class="h-full p-6 flex flex-auto flex-col flex-grow flex-shrink-0">
        <div class="w-full flex flex-row justify-between">
            <Text classes="text-left mb-4" type={TextType.h5}>{localize('general.assets')}</Text>
            <Filter filterStore={assetFilter} />
        </div>
        <div class="flex-auto overflow-y-scroll h-1 -mr-5 pr-4 scroll-secondary">
            <div class="-mr-4 overflow-x-visible space-y-2 ">
                {#if assets?.baseCoin || assets?.nativeTokens?.length > 0}
                    {#if assets?.baseCoin}
                        <AssetTile onClick={() => handleAssetTileClick(assets?.baseCoin)} asset={assets?.baseCoin} />
                    {/if}
                    {#each assets?.nativeTokens as asset}
                        <AssetTile onClick={() => handleAssetTileClick(asset)} {asset} />
                    {/each}
                {:else}
                    <div class="h-full flex flex-col items-center justify-center text-center">
                        <Text secondary>{localize('general.noAssets')}</Text>
                    </div>
                {/if}
            </div>
        </div>
    </div>
{/if}
