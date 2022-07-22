<script lang="typescript">
    import { localize } from '@core/i18n'
    import { IAssetState } from '@core/wallet/interfaces/assets-state.interface'
    import { openPopup } from '@lib/popup'
    import { AssetTile, Text } from 'shared/components'
    import { TextType } from 'shared/components/Text.svelte'

    export let assets: IAssetState

    function handleAssetTileClick(asset): void {
        openPopup({
            type: 'sendForm',
            overflow: true,
            props: {
                asset,
            },
        })
    }
</script>

{#if assets}
    <div class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0 p-6">
        <Text classes="text-left" type={TextType.h5}>{localize('general.assets')}</Text>
        <div class="flex flex-auto flex-col overflow-y-auto h-1 -mr-2 pr-2 space-y-2.5 scroll-secondary scrollable-y">
            <AssetTile onClick={() => handleAssetTileClick(assets?.baseCoin)} asset={assets?.baseCoin} />
            {#each assets?.nativeTokens as asset}
                <AssetTile onClick={() => handleAssetTileClick(asset)} {asset} />
            {/each}
        </div>
    </div>
{/if}
