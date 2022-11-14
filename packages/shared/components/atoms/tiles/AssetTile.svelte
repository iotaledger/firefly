<script lang="typescript">
    import { formatTokenAmountBestMatch, IAsset } from '@core/wallet'
    import { AssetIcon, ClickableTile, Text, FontWeight, TextType } from 'shared/components'
    import { truncateString } from '@core/utils'
    import { formatCurrency } from '@core/i18n/utils'
    import { getMarketAmountFromAssetValue } from '@core/market/utils/getMarketAmountFromAssetValue'
    import { getMarketPriceForAsset } from '@core/market/utils'

    export let asset: IAsset
    export let onClick: () => unknown
    export let squashed = false

    $: marketPrice = getMarketPriceForAsset(asset)
    $: marketBalance = getMarketAmountFromAssetValue(asset?.balance?.total, asset)
</script>

<ClickableTile {onClick} {...$$restProps}>
    <div class="w-full flex flex-row justify-between items-center">
        <div class="flex flex-row items-center text-left space-x-4">
            <AssetIcon small={squashed} {asset} />
            <div class="flex flex-col">
                <Text type={TextType.p} fontWeight={FontWeight.semibold}>
                    {asset?.metadata?.name
                        ? truncateString(asset?.metadata?.name, 13, 0)
                        : truncateString(asset?.id, 6, 7)}
                </Text>
                {#if !squashed}
                    <div class="flex flex-row justify-between items-center text-left">
                        <Text type={TextType.p} secondary smaller>{marketPrice ? formatCurrency(marketPrice) : ''}</Text
                        >
                        <slot name="subLabel" />
                    </div>
                {/if}
            </div>
        </div>
        <div class="flex flex-col text-right">
            <Text type={TextType.p} fontWeight={FontWeight.semibold}>
                {formatTokenAmountBestMatch(asset?.balance.total, asset?.metadata)}
            </Text>
            {#if !squashed}
                <div class="flex flex-row justify-between items-center text-right">
                    <Text type={TextType.p} secondary smaller classes="flex-grow">
                        {marketBalance ? `≈ ${formatCurrency(marketBalance)}` : ''}
                    </Text>
                </div>
            {/if}
        </div>
    </div>
</ClickableTile>
