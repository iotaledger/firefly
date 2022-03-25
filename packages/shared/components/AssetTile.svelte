<script lang="typescript">
    import { Icon, Text, StakingAssetTile } from 'shared/components'
    import { isBright } from 'shared/lib/helpers'
    import { Asset, Token } from 'shared/lib/typings/assets'

    export let asset: Asset

    const isStakingAsset = asset?.name === Token.Assembly || asset?.name === Token.Shimmer

    $: assetIconColor = isBright(asset?.color) ? 'gray-800' : 'white'
</script>

{#if isStakingAsset}
    <StakingAssetTile {asset} />
{:else}
    <div
        style="--asset-color: {asset?.color}"
        class="flex flex-row justify-between items-center space-x-2 bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl"
    >
        <div class="flex flex-row items-center space-x-4">
            <div class="icon h-8 w-8 rounded-full flex items-center justify-center p-1">
                <Icon
                    classes="text-{assetIconColor}"
                    icon={asset?.name?.toLocaleLowerCase()}
                    height="100%"
                    width="100%"
                />
            </div>
            <div class="flex flex-col flex-wrap space-y-1">
                <Text classes="font-semibold">{asset?.name}</Text>
                {#if asset?.fiatPrice}
                    <Text secondary smaller>{asset?.fiatPrice}</Text>
                {/if}
            </div>
        </div>
        <div class="flex flex-col flex-wrap space-y-1 text-right">
            <Text classes="font-semibold">{asset?.balance}</Text>
            {#if asset?.fiatBalance}
                <Text secondary smaller>{`≈ ${asset?.fiatBalance}`}</Text>
            {/if}
        </div>
    </div>
{/if}

<style type="text/scss">
    .icon {
        background-color: var(--asset-color);
    }
</style>
