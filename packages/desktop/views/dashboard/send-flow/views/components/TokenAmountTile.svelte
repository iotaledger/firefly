<script lang="ts">
    import { formatTokenAmountBestMatch, IAsset } from '@core/wallet'
    import { AssetIcon, Tile, Text, FontWeight } from '@ui'
    import { truncateString } from '@core/utils'
    import { getMarketAmountFromAssetValue, getMarketPriceForAsset } from '@core/market/utils'
    import { formatCurrency } from '@core/i18n'

    export let asset: IAsset
    export let amount: string

    $: marketAmount = asset ? getMarketAmountFromAssetValue(Number(amount), asset) : undefined
    $: marketPrice = getMarketPriceForAsset(asset)
</script>

{#if asset?.metadata && asset?.balance}
    <Tile>
        <div class="w-full flex flex-row justify-between items-center">
            <div class="flex flex-row items-center text-left space-x-4">
                <AssetIcon {asset} />
                <div class="flex flex-col">
                    <Text fontWeight={FontWeight.semibold}>
                        {asset.metadata.name
                            ? truncateString(asset.metadata.name, 13, 0)
                            : truncateString(asset.id, 6, 7)}
                    </Text>
                    <Text fontWeight={FontWeight.semibold} darkColor="gray-600">
                        {formatCurrency(marketPrice) || '--'}
                    </Text>
                </div>
            </div>
            <div class="flex flex-col text-right">
                <Text fontWeight={FontWeight.semibold}>
                    {formatTokenAmountBestMatch(Number(amount), asset.metadata)}
                </Text>
                <Text fontWeight={FontWeight.semibold} darkColor="gray-600">
                    {formatCurrency(marketAmount) || '--'}
                </Text>
            </div>
        </div>
    </Tile>
{/if}
