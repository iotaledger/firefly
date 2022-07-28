<script lang="typescript">
    import { localize } from '@core/i18n'
    import { IAccountAssets } from '@core/wallet'
    import { openPopup } from '@lib/popup'
    import { AssetTile, Text } from 'shared/components'
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
        <Text classes="text-left mb-4" type={TextType.h5}>{localize('general.assets')}</Text>
        <div class="flex-auto overflow-y-scroll h-1 -mr-5 pr-4 scroll-secondary">
            <div class="-mr-4 overflow-x-visible space-y-2 ">
                <AssetTile onClick={() => handleAssetTileClick(assets?.baseCoin)} asset={assets?.baseCoin} />
                {#each assets?.nativeTokens as asset}
                    {#if !asset?.hidden}
                        <AssetTile onClick={() => handleAssetTileClick(asset)} {asset} />
                    {/if}
                {/each}
            </div>
        </div>
    </div>
{/if}
