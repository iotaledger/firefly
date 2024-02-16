<script lang="ts">
    import { formatTokenAmountBestMatch, IAsset } from '@core/wallet'
    import { AssetIcon, ClickableTile, Text, FontWeight, TextType } from '@ui'
    import { truncateString } from '@core/utils'
    import { formatCurrency } from '@core/i18n/utils'
    import { getMarketAmountFromAssetValue } from '@core/market/utils/getMarketAmountFromAssetValue'
    import { getMarketPriceForAsset } from '@core/market/utils'
    import { AssetIconSize } from '@ui/enums'

    export let asset: IAsset | undefined
    export let onClick: () => unknown
    export let squashed = false
    export let selected = false
    export let classes = ''

    $: marketPrice = asset ? getMarketPriceForAsset(asset) : undefined
    $: marketBalance = asset ? getMarketAmountFromAssetValue(asset.balance?.total, asset) : undefined
</script>

{#if asset}
    <ClickableTile
        {onClick}
        {...$$restProps}
        classes="border-2 border-solid {selected
            ? 'border-blue-500 dark:border-gray-500'
            : 'border-transparent'} {classes}"
    >
        <div class="w-full flex flex-row justify-between items-center">
            <div class="flex flex-row items-center text-left space-x-4">
                <AssetIcon size={squashed ? AssetIconSize.Small : AssetIconSize.Medium} {asset} />
                <div class="flex flex-col">
                    <Text type={TextType.p} fontWeight={FontWeight.semibold}>
                        {asset.metadata?.name
                            ? truncateString(asset.metadata?.name, 13, 0)
                            : truncateString(asset.id, 6, 7)}
                    </Text>
                    {#if !squashed}
                        <div class="flex flex-row justify-between items-center text-left">
                            <Text type={TextType.p} secondary smaller
                                >{marketPrice ? formatCurrency(marketPrice) : ''}</Text
                            >
                            <slot name="subLabel" />
                        </div>
                    {/if}
                </div>
            </div>
            <div class="flex flex-col text-right">
                <Text type={TextType.p} fontWeight={FontWeight.semibold}>
                    {asset.metadata ? formatTokenAmountBestMatch(asset.balance?.total, asset.metadata) : '-'}
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
{/if}
