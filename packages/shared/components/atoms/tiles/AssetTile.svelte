<script lang="typescript">
    import { ButtonTile, StakingAssetTile } from 'shared/components'
    import { FontWeightText } from 'shared/components/Text.svelte'
    import { IAsset, formatTokenAmountBestMatch } from '@core/wallet'
    import { isBright } from '@lib/helpers'

    export let asset: IAsset

    const isStakingAsset = asset?.metadata.name === 'Assembly'

    $: assetIconColor = isBright(asset?.metadata?.primaryColor) ? 'gray-800' : 'white'

    function handleTileClick(): void {}
</script>

{#if isStakingAsset}
    <StakingAssetTile {asset} />
{:else}
    <ButtonTile
        icon={asset?.metadata.name?.toLocaleLowerCase()}
        iconColor={assetIconColor}
        iconBackgroundColor={asset?.metadata?.primaryColor}
        iconLabel={asset?.metadata.name}
        iconLabelFontWeight={FontWeightText.semibold}
        iconSubLabel={asset?.fiatPrice}
        tileText={formatTokenAmountBestMatch(asset?.balance.total, asset?.metadata)}
        tileSubText={`≈ ${asset?.fiatBalance}`}
        onClick={handleTileClick}
        {...$$restProps}
    />
{/if}

<style type="text/scss">
    .icon {
        background-color: var(--asset-color);
    }
</style>
