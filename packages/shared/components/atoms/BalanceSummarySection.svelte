<script lang="typescript">
    import { formatCurrency } from '@core/i18n'
    import { getMarketAmountFromAssetValue } from '@core/market/utils'
    import { formatTokenAmountPrecise, IAsset } from '@core/wallet'
    import { FontWeight, Text } from 'shared/components'

    export let totalRow = false
    export let title: string
    export let subtitle: string = ''
    export let amount: number
    export let asset: IAsset

    $: formattedAmount = formatTokenAmountPrecise(amount, asset.metadata)
    $: convertedAmount = formatCurrency(getMarketAmountFromAssetValue(amount, asset))

    const PRIMARY_COLOR = 'gray-800'
    const PRIMARY_DARK_COLOR = 'white'
    const PRIMARY_FONT_SIZE = '15'
    const PRIMARY_FONT_WEIGHT = FontWeight.normal
    const PRIMARY_LINE_HEIGHT = '5'

    const SECONDARY_COLOR = 'gray-600'
    const SECONDARY_DARK_COLOR = 'gray-400'
    const SECONDARY_FONT_SIZE = '13'
    const SECONDARY_FONT_WEIGHT = FontWeight.medium
    const SECONDARY_LINE_HEIGHT = '4'
</script>

<div class="flex justify-between">
    <div class={title ? 'flex flex-col space-y-0.5' : ''}>
        <Text
            color={PRIMARY_COLOR}
            darkColor={PRIMARY_DARK_COLOR}
            fontSize={PRIMARY_FONT_SIZE}
            fontWeight={totalRow ? FontWeight.semibold : PRIMARY_FONT_WEIGHT}
            lineHeight={PRIMARY_LINE_HEIGHT}
        >
            {title}
        </Text>
        {#if subtitle}
            <Text
                color={SECONDARY_COLOR}
                darkColor={SECONDARY_DARK_COLOR}
                fontSize={SECONDARY_FONT_SIZE}
                fontWeight={SECONDARY_FONT_WEIGHT}
                lineHeight={SECONDARY_LINE_HEIGHT}
            >
                {subtitle}
            </Text>
        {/if}
    </div>
    <div class={formattedAmount ? 'flex flex-col items-end space-y-0.5' : ''}>
        <Text
            color={PRIMARY_COLOR}
            darkColor={PRIMARY_DARK_COLOR}
            fontSize={PRIMARY_FONT_SIZE}
            fontWeight={totalRow ? FontWeight.semibold : PRIMARY_FONT_WEIGHT}
            lineHeight={PRIMARY_LINE_HEIGHT}
        >
            {formattedAmount}
        </Text>
        <Text
            color={SECONDARY_COLOR}
            darkColor={SECONDARY_DARK_COLOR}
            fontSize={SECONDARY_FONT_SIZE}
            fontWeight={SECONDARY_FONT_WEIGHT}
            lineHeight={SECONDARY_LINE_HEIGHT}
        >
            {convertedAmount}
        </Text>
    </div>
</div>
