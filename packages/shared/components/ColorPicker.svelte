<script lang="typescript">
    import { localize } from '@core/i18n'
    import { clickOutside } from '@lib/actions'
    import { isBright } from '@lib/helpers'
    import { AccountColor } from '@lib/typings/color'
    import { GradientPicker, Icon, Text, Tooltip } from 'shared/components'
    import { mobile } from 'shared/lib/app'

    export let active
    export let title = localize('views.picker.color.title')
    export let classes = ''

    const accountColors = Object.values(AccountColor).filter((c) => /[#]/.test(c as string))
    const hex2rgb = (hex) => {
        hex = hex.length >= 7 ? hex : '#FFFFFF'
        return hex
            .match(/\w\w/g)
            ?.map((x) => parseInt(x, 16))
            .join(',')
    }

    const activeAccountColorIndex = accountColors.findIndex((_, i) => accountColors[i] === active)
    let activeElement = activeAccountColorIndex >= 0 ? activeAccountColorIndex : accountColors.length

    const handleKeyPress = (event, i) => event.key === 'Enter' && (activeElement = i)
    const handleColorClick = (i) => (activeElement = i)
    const activeCustomColor = () => (activeElement = accountColors.length)

    $: if (activeElement >= accountColors.length) {
        active = inputValue.length >= 7 ? inputValue : '#FFFFFF'
    } else {
        active = accountColors[activeElement]
    }
    let inputValue = activeAccountColorIndex >= 0 ? '#FFFFFF' : active
    $: inputValue = `#${inputValue?.match(/[0-9|a-f|A-F]+/) || ''}`
    let inputColor
    $: if (inputValue.length >= 7) {
        inputColor = isBright(inputValue) ? 'gray-800' : 'white'
    } else {
        inputColor = 'gray-800'
    }

    let tooltipAnchor
    let showTooltip = false
    const toggleTooltip = (): void => {
        showTooltip = !showTooltip
    }

    let isCustomHover = false
    const toggleCustomHover = (): void => {
        isCustomHover = !isCustomHover
    }

    $: customActiveFilled = activeElement === accountColors.length && inputValue.length >= 7
</script>

<div
    style="--account-color: {inputValue ? hex2rgb(active) : ''}; --custom-color: {hex2rgb(inputValue)};"
    class={classes}
>
    <div class="flex flex-row mb-4">
        <Text type="h5">{title}</Text>
    </div>
    <ul class="{$mobile ? 'grid grid-cols-5' : 'flex flex-row flex-wrap'} gap-3.5">
        {#each Object.keys(AccountColor).reduce((acc, val) => (/[#]/.test(val) ? acc : [...acc, val.toLowerCase()]), []) as color, i}
            <li
                tabindex="0"
                class="w-12 h-12 rounded-lg ring-opacity-30 hover:ring-opacity-40 cursor-pointer flex justify-center items-center
                bg-{color}-500 hover:bg-{color}-600 focus:bg-{color}-600 ring-{color}-500"
                class:ring-4={activeElement === i}
                on:click={() => handleColorClick(i)}
                on:keypress={(event) => handleKeyPress(event, i)}
                aria-label={color}
            >
                {#if activeElement === i}<Icon icon="checkmark" classes="text-white" />{/if}
            </li>
        {/each}
        <li
            tabindex="0"
            class="w-12 h-12 rounded-lg ring-opacity-30 hover:ring-opacity-40 cursor-pointer flex justify-center items-center
            custom-color hover:bg-gray-50 focus:bg-white ring-white"
            on:click={toggleTooltip}
            bind:this={tooltipAnchor}
            class:active={customActiveFilled}
            class:ring-4={customActiveFilled}
            on:click={activeCustomColor}
            on:mouseenter={toggleCustomHover}
            on:mouseleave={toggleCustomHover}
        >
            <Icon icon="edit" classes={isCustomHover ? 'text-gray-800' : `text-${inputColor}`} />
        </li>
    </ul>
    {#if showTooltip}
        {#if $mobile}
            <GradientPicker on:input={(ev) => (inputValue = ev.detail)} />
        {:else}
            <div use:clickOutside on:clickOutside={toggleTooltip}>
                <Tooltip anchor={tooltipAnchor} position="top">
                    <Text type="p">{localize('views.picker.color.hexCode')}</Text>
                    <input
                        type="text"
                        placeholder="#"
                        pattern="[A-F0-9]{10}"
                        maxlength="7"
                        bind:value={inputValue}
                        on:click={activeCustomColor}
                        class="w-24 h-full text-16 uppercase leading-140 border border-solid mt-2 bg-white dark:bg-gray-800 border-gray-300
                        text-gray-800 dark:text-white dark:border-gray-700
                        hover:border-gray-500 dark:hover:border-gray-700 p-1 rounded text-center"
                        class:ring-4={customActiveFilled}
                        class:active={customActiveFilled}
                    />
                </Tooltip>
            </div>
        {/if}
    {/if}
</div>

<style type="text/scss">
    input {
        background-color: transparent;
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
