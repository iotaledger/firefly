<script lang="typescript">
    import { setClipboard } from 'shared/lib/utils'
    import Box from './Box.svelte'
    import { Text, Tooltip } from 'shared/components'
    import { localize } from '@core/i18n'
    import { FontWeightText } from 'shared/components/Text.svelte'

    export let value = ''
    export let isCopyable = true
    export let clearPadding = false

    let tooltipAnchor
    let showTooltip = false

    function onClick(): void {
        if (isCopyable) {
            setClipboard(value, false)
            showTooltip = true
        }

        setTimeout(() => {
            showTooltip = false
        }, 1500)
    }
</script>

{#if value}
    <button
        bind:this={tooltipAnchor}
        on:click={onClick}
        class="{clearPadding ? '' : 'w-full'} {isCopyable ? 'cursor-pointer' : 'cursor-default'}"
    >
        <Box {clearPadding} {...$$restProps}>
            <slot />
        </Box>
    </button>
{/if}
{#if isCopyable && showTooltip}
    <Tooltip
        anchor={tooltipAnchor}
        offset={15}
        position="top"
        size="small"
        backgroundColor="green-600"
        borderColor="green-600"
    >
        <Text type="p" fontSize="14" fontWeight={FontWeightText.semibold} color="white"
            >{localize('general.copiedToClipboard')}</Text
        >
    </Tooltip>
{/if}
