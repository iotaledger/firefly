<script lang="ts">
    import { Text, Icon, Tooltip, TextType, Position } from 'shared/components'
    import { AccountColors } from '@core/account'
    import { localize } from '@core/i18n'
    import { clickOutside, isBright, convertHexToRgba } from '@core/utils'
    import { Icon as IconEnum } from '@auxiliary/icon'

    export let title: string = localize('views.picker.color.title')
    export let active: string = ''
    export let isCustomColorEnabled: boolean = false

    const accountColors = Object.values(AccountColors).filter((c) => /[#]/.test(c as string))
    const activeAccountColorIndex = accountColors.findIndex((_, i) => accountColors[i] === active)

    let indexOfActiveElement = activeAccountColorIndex >= 0 ? activeAccountColorIndex : accountColors.length
    let cachedColor = '#000000'
    let inputValue: string = activeAccountColorIndex >= 0 ? cachedColor : active
    let iconColor = ''
    let isTooltipVisible = false
    let tooltipAnchor: HTMLElement

    $: inputValue = `#${/[0-9|a-f|A-F]+/.exec(inputValue) || ''}`
    $: isSelectedCustomElement = indexOfActiveElement === accountColors.length

    $: {
        if (indexOfActiveElement === accountColors.length) {
            active === cachedColor
        }

        if (indexOfActiveElement === accountColors.length) {
            active = inputValue.length === 7 || inputValue.length === 4 ? inputValue : cachedColor
        } else {
            active = accountColors?.[indexOfActiveElement]?.toString()
        }

        if (inputValue.length) {
            iconColor = isBright(cachedColor) ? 'text-gray-800' : 'text-white'
        } else {
            iconColor = 'text-gray-800'
        }

        if (inputValue.length === 4 || inputValue.length === 7) {
            cachedColor = inputValue
        }
    }

    function onKeyPress(event: KeyboardEvent, index: number): void {
        if (event.key === 'Enter') {
            indexOfActiveElement = index
        }
    }

    function onColorClick(index: number): void {
        indexOfActiveElement = index
        if (index !== accountColors.length) {
            isTooltipVisible = false
        }
    }

    function toggleTooltip(event: KeyboardEvent | MouseEvent): void {
        const isEnterKeyPressed = event.type === 'keypress' && (event as KeyboardEvent).key === 'Enter'
        if (event.type === 'click' || isEnterKeyPressed) {
            isTooltipVisible = !isTooltipVisible
        }
        inputValue = cachedColor
    }

    function activeCustomColor(event: KeyboardEvent | MouseEvent): void {
        const isEnterKeyPressed = event.type === 'keypress' && (event as KeyboardEvent).key === 'Enter'
        if (event.type === 'click' || isEnterKeyPressed) {
            indexOfActiveElement = accountColors.length
        }
    }

    function getAccountColors(): string[] {
        return Object.keys(AccountColors)
            .filter((key) => key.startsWith('#'))
            .map((key) => {
                const color = AccountColors[key as keyof typeof AccountColors].toString().toLowerCase()
                return `bg-${color}-500 hover:bg-${color}-600`
            })
    }
</script>

<color-picker
    style:--custom-color={convertHexToRgba(cachedColor)}
    style:--custom-color-ring={convertHexToRgba(cachedColor, 30)}
>
    {#if title}
        <title-container class="flex flex-row mb-4">
            <Text type={TextType.h5}>{title}</Text>
        </title-container>
    {/if}
    <ul class="flex flex-row flex-wrap gap-3.5">
        {#each getAccountColors() as color, i}
            <button
                on:click={() => onColorClick(i)}
                on:keypress={(event) => onKeyPress(event, i)}
                tabindex="0"
                aria-label={color}
                class="w-12 h-12 rounded-lg cursor-pointer flex justify-center items-center {color}"
                class:ring-4={indexOfActiveElement === i}
            >
                {#if indexOfActiveElement === i}
                    <Icon icon={IconEnum.Checkmark} classes="text-white" />
                {/if}
            </button>
        {/each}
        {#if isCustomColorEnabled}
            <button
                bind:this={tooltipAnchor}
                on:click={toggleTooltip}
                on:click={activeCustomColor}
                on:keypress={toggleTooltip}
                on:keypress={activeCustomColor}
                tabindex="0"
                class="custom-color"
                class:ring-4={isSelectedCustomElement}
            >
                <Icon icon={IconEnum.Edit} classes={iconColor} />
            </button>
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
                />
            </Tooltip>
        </tooltip-container>
    {/if}
</color-picker>

<style lang="scss">
    input {
        @apply w-24 h-full mt-2 p-1 rounded;
        @apply uppercase text-16 leading-140 text-gray-800 text-center;
        @apply border border-solid border-gray-300 hover:border-gray-500;
        @apply bg-transparent;
        @apply dark:text-white dark:bg-gray-800 dark:border-gray-700 dark:hover:border-gray-700;
    }

    .custom-color {
        @apply w-12 h-12;
        @apply flex;
        @apply justify-center items-center;
        @apply rounded-lg;
        @apply hover:bg-gray-50 focus:bg-white;
        @apply ring-white;
        @apply ring-opacity-30 hover:ring-opacity-40;
        background-color: var(--custom-color);
        --tw-ring-color: var(--custom-color-ring);
    }
</style>
