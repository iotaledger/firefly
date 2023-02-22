<script lang="ts">
    import { Text, Icon, Tooltip, TextType, Position } from 'shared/components'
    import { AccountColors } from '@core/account'
    import { localize } from '@core/i18n'
    import { clickOutside, isBright, hex2rgb } from '@core/utils'
    import { Icon as IconEnum } from '@auxiliary/icon'

    export let title = localize('views.picker.color.title')
    export let active = ''
    export let classes = ''
    export let isCustomColorEnabled = false

    const accountColors = Object.values(AccountColors).filter((c) => /[#]/.test(c as string))
    const activeAccountColorIndex = accountColors.findIndex((_, i) => accountColors[i] === active)

    let activeElement = activeAccountColorIndex >= 0 ? activeAccountColorIndex : accountColors.length
    let inputValue: string = activeAccountColorIndex >= 0 ? '#FFFFFF' : active
    let inputColor = ''
    let isTooltipVisible = false
    let isCustomHover = false
    let tooltipAnchor: HTMLElement

    $: inputValue = `#${/[0-9|a-f|A-F]+/.exec(inputValue) || ''}`
    $: customActiveFilled = activeElement === accountColors.length && inputValue.length >= 7

    $: if (activeElement >= accountColors.length) {
        active = inputValue.length >= 7 ? inputValue : '#FFFFFF'
    } else {
        active = accountColors?.[activeElement]?.toString()
    }

    $: if (inputValue.length >= 7) {
        inputColor = isBright(inputValue) ? 'gray-800' : 'white'
    } else {
        inputColor = 'gray-800'
    }

    function onKeyPress(event: KeyboardEvent, index: number): void {
        if (event.key === 'Enter') {
            activeElement = index
        }
    }

    function onColorClick(index: number): void {
        activeElement = index
    }

    function toggleCustomHover(): void {
        isCustomHover = !isCustomHover
    }

    function toggleTooltip(event: KeyboardEvent | MouseEvent): void {
        const isEnterKeyPressed = event.type === 'keypress' && (event as KeyboardEvent).key === 'Enter'
        if (event.type === 'click' || isEnterKeyPressed) {
            isTooltipVisible = !isTooltipVisible
        }
    }

    function activeCustomColor(event: KeyboardEvent | MouseEvent): void {
        const isEnterKeyPressed = event.type === 'keypress' && (event as KeyboardEvent).key === 'Enter'
        if (event.type === 'click' || isEnterKeyPressed) {
            activeElement = accountColors.length
        }
    }

    function getAccountColorsNames(): string[] {
        return Object.keys(AccountColors).reduce(
            (acc, val) => (/[#]/.test(val) ? acc : [...acc, val.toLowerCase()]),
            []
        )
    }
</script>

<color-picker
    style:--account-color={inputValue ? hex2rgb(active) : ''}
    style:--custom-color={hex2rgb(inputValue)}
    class="block {classes}"
>
    {#if title}
        <title-container class="flex flex-row mb-4">
            <Text type={TextType.h5}>{title}</Text>
        </title-container>
    {/if}
    <ul class="flex flex-row flex-wrap gap-3.5">
        {#each getAccountColorsNames() as color, i}
            <li
                on:click={() => onColorClick(i)}
                on:keypress={(event) => onKeyPress(event, i)}
                tabindex="0"
                aria-label={color}
                class="w-12 h-12 rounded-lg ring-opacity-30 hover:ring-opacity-40 cursor-pointer flex justify-center items-center
                bg-{color}-500 hover:bg-{color}-600 focus:bg-{color}-600 ring-{color}-500"
                class:ring-4={activeElement === i}
            >
                {#if activeElement === i}
                    <Icon icon={IconEnum.Checkmark} classes="text-white" />
                {/if}
            </li>
        {/each}
        {#if isCustomColorEnabled}
            <li
                bind:this={tooltipAnchor}
                on:click={toggleTooltip}
                on:click={activeCustomColor}
                on:keypress={toggleTooltip}
                on:keypress={activeCustomColor}
                on:mouseenter={toggleCustomHover}
                on:mouseleave={toggleCustomHover}
                tabindex="0"
                class="w-12 h-12 rounded-lg ring-opacity-30 hover:ring-opacity-40 cursor-pointer flex justify-center items-center
                custom-color hover:bg-gray-50 focus:bg-white ring-white"
                class:active={customActiveFilled}
                class:ring-4={customActiveFilled}
            >
                <Icon icon={IconEnum.Edit} classes={isCustomHover ? 'text-gray-800' : `text-${inputColor}`} />
            </li>
        {/if}
    </ul>
    {#if isTooltipVisible}
        <tooltip-container class="block" use:clickOutside on:clickOutside={toggleTooltip}>
            <Tooltip anchor={tooltipAnchor} position={Position.Top}>
                <Text type={TextType.p}>{localize('views.picker.color.hexCode')}</Text>
                <input
                    bind:value={inputValue}
                    on:click={activeCustomColor}
                    type="text"
                    placeholder="#"
                    pattern="[A-F0-9]{10}"
                    maxlength="7"
                    class:ring-4={customActiveFilled}
                    class:active={customActiveFilled}
                />
            </Tooltip>
        </tooltip-container>
    {/if}
</color-picker>

<style lang="scss">
    input {
        @apply w-24 h-full mt-2 p-1 rounded;
        @apply uppercase text-16 leading-140 text-gray-800 dark:text-white text-center;
        @apply border border-solid border-gray-300 dark:border-gray-700 hover:border-gray-500 dark:hover:border-gray-700;
        @apply bg-transparent dark:bg-gray-800;
    }

    .active {
        background-color: rgb(var(--account-color));
        --tw-ring-color: rgba(var(--account-color), var(--tw-ring-opacity));
        --tw-ring-opacity: 0.3;
    }

    .custom-color {
        background-color: rgb(var(--custom-color));
        --tw-ring-color: rgba(var(--custom-color), var(--tw-ring-opacity));
        --tw-ring-opacity: 0.3;
    }
</style>
