<script lang="typescript">
    import { accountRouter } from '@core/router'
    import { AccountRoute } from '@core/router/enums'
    import { Icon, StakingAssetTile, Text } from 'shared/components'
    import { isBright } from 'shared/lib/helpers'
    import { Asset, Token } from 'shared/lib/typings/assets'
    import { mobile } from '@lib/app'

    export let asset: Asset

    const isStakingAsset = asset?.name === Token.Assembly || asset?.name === Token.Shimmer

    $: assetIconColor = isBright(asset?.color) ? 'gray-800' : 'white'

    function handleTileClick(): void {
        $accountRouter.goTo(AccountRoute.Send)
    }
</script>

{#if isStakingAsset}
    <StakingAssetTile {asset} />
{:else}
    <button
        style="--asset-color: {asset?.color}"
        class="w-full flex flex-row justify-between items-center space-x-2 bg-gray-50 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-700 p-4 rounded-2xl"
        on:click={handleTileClick}
    >
        <div class="flex flex-row items-center space-x-4 text-left">
            <div class="icon h-8 w-8 rounded-full flex items-center justify-center p-1">
                <Icon
                    classes="text-{assetIconColor}"
                    icon={asset?.name?.toLocaleLowerCase()}
                    height="100%"
                    width="100%"
                />
            </div>
            <div class="flex flex-col flex-wrap {$mobile ? 'space-y-1/2' : 'space-y-1'}">
                <Text classes="font-semibold">{asset?.name}</Text>
                {#if asset?.fiatPrice}
                    <Text secondary smaller={!$mobile}>{asset?.fiatPrice}</Text>
                {/if}
            </div>
        </div>
        <div class="flex flex-col flex-wrap {$mobile ? 'space-y-1/2' : 'space-y-1'} text-right">
            <Text classes="font-semibold">{asset?.balance}</Text>
            {#if asset?.fiatBalance}
                <Text secondary smaller={!$mobile}>{`≈ ${asset?.fiatBalance}`}</Text>
            {/if}
        </div>
    </button>
{/if}

<style type="text/scss">
    .icon {
        background-color: var(--asset-color);
    }
</style>
