<script lang="ts">
    import { FontWeight, Text } from 'shared/components'

    export let title: string
    export let subtitle: string | undefined = undefined
    export let bold: boolean = false
    export let amount: string
    export let convertedAmount: string

    const PRIMARY_TEXT_CONFIG = {
        color: 'gray-800',
        darkColor: 'white',
        fontSize: '15',
        fontWeight: bold ? FontWeight.semibold : FontWeight.normal,
        lineHeight: '5',
    }

    const SECONDARY_TEXT_CONFIG = {
        color: 'gray-600',
        darkColor: 'gray-400',
        fontSize: '13',
        fontWeight: FontWeight.normal,
        lineHeight: '4',
    }
</script>

<div class="flex flex-row justify-between flex-grow">
    <div class={title ? 'flex flex-col space-y-0.5' : null}>
        <Text {...PRIMARY_TEXT_CONFIG}>{title}</Text>
        {#if subtitle}
            <Text {...SECONDARY_TEXT_CONFIG}>{subtitle}</Text>
        {/if}
    </div>
    <div class="flex flex-col items-end space-y-0.5">
        <Text {...PRIMARY_TEXT_CONFIG} classes="text-right">{amount}</Text>
        <Text {...SECONDARY_TEXT_CONFIG} classes="text-right">{convertedAmount}</Text>
    </div>
</div>
