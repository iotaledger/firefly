<script lang="ts">
    import { FontWeight, Text } from '@ui'

    export let title: string
    export let subtitle: string | undefined = undefined
    export let bold: boolean = false
    export let amount: string
    export let convertedAmount: string
    export let secondaryStyle: boolean = false

    const TEXT_CONFIG = {
        primary: {
            color: 'gray-800',
            darkColor: 'white',
            fontSize: '15',
            fontWeight: bold ? FontWeight.semibold : FontWeight.normal,
            lineHeight: '5',
        },
        secondary: {
            color: 'gray-600',
            darkColor: 'gray-400',
            fontSize: '13',
            fontWeight: FontWeight.normal,
            lineHeight: '4',
        },
    }
</script>

<div class="flex flex-row justify-between flex-grow">
    <div class={title ? 'flex flex-col space-y-0.5' : null}>
        <Text {...secondaryStyle ? TEXT_CONFIG.secondary : TEXT_CONFIG.primary}>
            {title}
        </Text>
        {#if subtitle}
            <Text {...TEXT_CONFIG.secondary}>{subtitle}</Text>
        {/if}
    </div>
    <div class="flex flex-col items-end space-y-0.5">
        <Text {...secondaryStyle ? TEXT_CONFIG.secondary : TEXT_CONFIG.primary} classes="text-right">
            {amount}
        </Text>
        <Text {...TEXT_CONFIG.secondary} classes="text-right">{convertedAmount}</Text>
    </div>
</div>
