<script lang="typescript">
    import { Text, TooltipIcon, FontWeight } from 'shared/components'
    import { onMount } from 'svelte'
    import CopyableBox from './CopyableBox.svelte'

    export let keyText: string = ''
    export let valueText: string = ''
    export let textColor: string = 'gray-600'
    export let darkTextColor: string = 'gray-500'
    export let backgroundColor: string = 'gray-50'
    export let darkBackgroundColor: string = 'gray-850'
    export let padding: string = 'px-4 py-2.5'
    export let classes: string = ''
    export let copyValue: string = ''
    export let isCopyable: boolean = false
    export let tooltipText: string = ''
    export let shrink: boolean = false
    export let isPreText: boolean = false
    export let maxHeight: number

    let isVertical: boolean = false
    let valueContainer: HTMLElement
    let valueContainerWidth: number

    onMount(() => {
        isVertical = (valueContainer?.firstChild as HTMLElement)?.scrollWidth > valueContainerWidth
    })
</script>

<div class={shrink ? '' : 'w-full'}>
    <CopyableBox
        value={copyValue ? copyValue : valueText}
        {isCopyable}
        offset={5}
        row={!isVertical}
        col={isVertical}
        {backgroundColor}
        {darkBackgroundColor}
        clearBoxPadding
        classes="w-full overflow-hidden {padding} {classes}"
    >
        <div
            class="
                w-full flex text-left  
                {isVertical ? 'flex-col space-y-1 overflow-y-auto' : 'flex-row space-x-2 justify-between'}
                {maxHeight ? `min-h-${maxHeight}` : 'max-h-20'}
            "
        >
            <div class="flex flex-row items-center">
                {#if keyText}
                    <Text
                        fontSize="13"
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
                {#if tooltipText}
                    <TooltipIcon text={tooltipText} title={keyText} width={15} height={15} classes="ml-1" />
                {/if}
            </div>
            {#if valueText}
                <div
                    bind:this={valueContainer}
                    bind:clientWidth={valueContainerWidth}
                    class="
                        {isVertical ? 'break-words' : 'truncate'}
                        {isPreText ? 'whitespace-pre-wrap' : ''}    
                    "
                >
                    <Text
                        fontSize="13"
                        lineHeight="16"
                        color={textColor}
                        darkColor={darkTextColor}
                        classes={isVertical ? '' : 'truncate'}
                    >
                        {valueText}
                    </Text>
                </div>
            {:else}
                <slot name="value" />
            {/if}
        </div>
    </CopyableBox>
</div>
