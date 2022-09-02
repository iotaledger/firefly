<script lang="typescript">
    import { Text, Tooltip } from 'shared/components'
    import { FontWeight } from 'shared/components/Text.svelte'
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
    export let vertical: boolean = false

    let showTooltip = false
    let tooltipAnchor: HTMLElement
    let textContainerWidth: number

    $: isValueTextTruncated = (tooltipAnchor?.firstChild as HTMLElement)?.scrollWidth > textContainerWidth

    function toggleTooltip(show: boolean): void {
        if (isValueTextTruncated && !isCopyable) {
            showTooltip = show
        }
    }
</script>

<div on:mouseleave={() => toggleTooltip(false)} class="w-full">
    <CopyableBox
        value={copyValue ? copyValue : valueText}
        {isCopyable}
        offset={5}
        row
        {backgroundColor}
        {darkBackgroundColor}
        classes="w-full {padding} {classes} flex flex-{vertical ? 'col' : 'row'} justify-between"
    >
        {#if keyText}
            <Text
                fontSize="14"
                lineHeight="5"
                color={textColor}
                darkColor={darkTextColor}
                fontWeight={FontWeight.semibold}
                classes="mr-4"
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
                class="truncate"
                bind:this={tooltipAnchor}
                bind:clientWidth={textContainerWidth}
            >
                <Text fontSize="14" lineHeight="5" color={textColor} darkColor={darkTextColor} classes="truncate">
                    {valueText}
                </Text>
            </div>
            {#if showTooltip}
                <Tooltip anchor={tooltipAnchor} position="top">
                    <div class="max-h-40 overflow-y-scroll pr-0">
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
