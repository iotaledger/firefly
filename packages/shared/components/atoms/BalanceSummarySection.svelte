<script lang="typescript">
    import { FontWeightText } from 'shared/components/Text.svelte'
    import { Text } from 'shared/components'
    import { formatPreciseTokenAmount } from '@core/wallet'
    import { BASE_TOKEN } from '@core/network'
    import { activeProfile } from '@core/profile'

    export let title: string
    export let subtitle: string
    export let totalRow = false
    export let amount: number

    $: formattedAmount = formatPreciseTokenAmount(amount, BASE_TOKEN[$activeProfile.networkProtocol])
    $: convertedAmount = '-'

    const PRIMARY_COLOR = 'gray-800'
    const PRIMARY_DARK_COLOR = 'white'
    const PRIMARY_FONT_SIZE = '15'
    const PRIMARY_FONT_WEIGHT = FontWeightText.normal
    const PRIMARY_LINE_HEIGHT = '20'

    const SECONDARY_COLOR = 'gray-600'
    const SECONDARY_DARK_COLOR = 'gray-400'
    const SECONDARY_FONT_SIZE = '13'
    const SECONDARY_FONT_WEIGHT = FontWeightText.medium
    const SECONDARY_LINE_HEIGHT = '16'
</script>

<div class="flex justify-between">
    <div class={title ? 'flex flex-col space-y-0.5' : ''}>
        <Text
            color={PRIMARY_COLOR}
            darkColor={PRIMARY_DARK_COLOR}
            fontSize={PRIMARY_FONT_SIZE}
            fontWeight={totalRow ? FontWeightText.semibold : PRIMARY_FONT_WEIGHT}
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
            fontWeight={totalRow ? FontWeightText.semibold : PRIMARY_FONT_WEIGHT}
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
