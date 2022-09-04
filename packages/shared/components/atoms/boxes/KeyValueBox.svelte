<script lang="typescript">
    import { Text, Tooltip } from 'shared/components'
    import { FontWeight } from 'shared/components/Text.svelte'
    import { onMount } from 'svelte'
    import CopyableBox from './CopyableBox.svelte'

    export let keyText: string = ''
    export let valueText: string = ''
    export let textColor: string = 'gray-600'
    export let darkTextColor: string = 'gray-500'
    export let backgroundColor: string = 'gray-50'
    export let darkBackgroundColor: string = 'gray-850'
    export let padding: string = 'px-4 py-3.5'
    export let classes: string = ''
    export let copyValue: string = ''
    export let isCopyable: boolean = false

    let isVertical: boolean = false
    let showTooltip = false
    let tooltipAnchor: HTMLElement
    let textContainerWidth: number

    function toggleTooltip(show: boolean): void {
        if (isVertical && !isCopyable) {
            showTooltip = show
        }
    }

    onMount(() => {
        isVertical = (tooltipAnchor?.firstChild as HTMLElement)?.scrollWidth > textContainerWidth
    })
</script>

<div on:mouseleave={() => toggleTooltip(false)} class="w-full">
    <CopyableBox
        value={copyValue ? copyValue : valueText}
        {isCopyable}
        offset={5}
        row={!isVertical}
        col={isVertical}
        {backgroundColor}
        {darkBackgroundColor}
        classes="w-full text-left {padding} {classes} justify-between {isVertical ? 'space-y-1' : 'space-x-2 '}"
    >
        {#if keyText}
            <Text
                fontSize="14"
                lineHeight="5"
                color={textColor}
                darkColor={darkTextColor}
                fontWeight={FontWeight.medium}
            >
                {keyText}
            </Text>
        {:else}
            <slot name="key" />
        {/if}
        {#if valueText}
            <div
                on:focus={() => toggleTooltip(true)}
                on:mouseover={() => toggleTooltip(true)}
                bind:this={tooltipAnchor}
                bind:clientWidth={textContainerWidth}
                class={isVertical ? 'max-h-10 break-words overflow-y-scroll overflow-hidden' : 'truncate'}
            >
                <Text
                    fontSize="14"
                    lineHeight="5"
                    color={textColor}
                    darkColor={darkTextColor}
                    classes={isVertical ? '' : 'truncate'}
                >
                    {valueText}
                </Text>
            </div>
            {#if showTooltip}
                <Tooltip anchor={tooltipAnchor} position="top">
                    <div class="max-h-40 overflow-y-scroll pr-0 text-left break-words">
                        <Text color={textColor} darkColor={darkTextColor} classes="text-left break-words"
                            >{valueText}</Text
                        >
                    </div>
                </Tooltip>
            {/if}
        {:else}
            <slot name="value" />
        {/if}
    </CopyableBox>
</div>
