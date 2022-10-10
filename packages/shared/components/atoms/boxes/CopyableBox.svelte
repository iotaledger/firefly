<script lang="typescript">
    import { setClipboard } from 'shared/lib/utils'
    import Box from './Box.svelte'
    import { Text, Tooltip, FontWeight } from 'shared/components'
    import { localize } from '@core/i18n'
    import { onDestroy } from 'svelte'

    export let value = ''
    export let isCopyable = true
    export let clearPadding = false
    export let clearBoxPadding = false
    export let offset: number = undefined
    export let classes = ''

    let tooltipAnchor
    let showTooltip = false

    export function onClick(): void {
        if (isCopyable) {
            setClipboard(value, false)
            showTooltip = true
        }

        setTimeout(() => {
            showTooltip = false
        }, 1500)
    }

    onDestroy(() => {
        showTooltip = false
    })
</script>

{#if value !== null && value !== undefined}
    <button
        bind:this={tooltipAnchor}
        on:click={onClick}
        class="{clearPadding ? '' : 'w-full'} {isCopyable ? 'cursor-pointer' : 'cursor-default'}"
    >
        <Box clearPadding={clearBoxPadding} {...$$restProps} {classes}>
            <slot />
        </Box>
    </button>
{/if}
{#if isCopyable && showTooltip}
    <Tooltip
        anchor={tooltipAnchor}
        offset={clearPadding ? offset ?? 25 : offset ?? 15}
        position="top"
        size="small"
        backgroundColor="green-600"
        borderColor="green-600"
    >
        <Text type="p" fontSize="14" fontWeight={FontWeight.semibold} color="white"
            >{localize('general.copiedToClipboard')}</Text
        >
    </Tooltip>
{/if}
