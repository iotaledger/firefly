<script lang="typescript">
    import { Text } from 'shared/components'
    import { formatTokenAmountPrecise } from '@core/wallet'
    import { BASE_TOKEN } from '@core/network'
    import { activeProfile } from '@core/profile'

    export let bold = false
    export let title: string
    export let subtitle: string
    export let amount: number

    $: formattedAmount = formatTokenAmountPrecise(amount, BASE_TOKEN[$activeProfile.networkProtocol])
    $: convertedAmount = '-'

    const PRIMARY_COLOR = 'gray-800'
    const PRIMARY_DARK_COLOR = 'white'
</script>

<div class="flex justify-between">
    <div class={title ? 'flex flex-col space-y-0.5' : ''}>
        <Text type="large" color={PRIMARY_COLOR} darkColor={PRIMARY_DARK_COLOR} {bold}>
            {title}
        </Text>
        {#if subtitle}
            <Text type="small">{subtitle}</Text>
        {/if}
    </div>
    <div class={formattedAmount ? 'flex flex-col items-end space-y-0.5' : ''}>
        <Text type="large" color={PRIMARY_COLOR} darkColor={PRIMARY_DARK_COLOR} {bold}>
            {formattedAmount}
        </Text>
        <Text type="small">{convertedAmount}</Text>
    </div>
</div>
