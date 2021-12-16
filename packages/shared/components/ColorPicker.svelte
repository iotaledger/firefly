<script lang="typescript">
    import { Text, Icon } from 'shared/components'
    import { AccountColors } from 'shared/lib/wallet'
    import { isBright } from 'shared/lib/helpers'

    export let active
    export let locale
    export let title = locale('views.pickers.color')
    export let classes = ''

    const accountColors = Object.values(AccountColors).filter(c => /[#]/.test(c as string))
    const hex2rgb = hex => hex.match(/\w\w/g)?.map(x => parseInt(x, 16)).join(',')

    const activeAccountColorIndex = accountColors.findIndex((_, i) => accountColors[i] === active)
    let activeElement = activeAccountColorIndex >= 0 ? activeAccountColorIndex : accountColors.length

    const handleKeyPress = (event, i) => event.key === 'Enter' && (activeElement = i)
    const handleColorClick = (i) => activeElement = i
    const handleInputClick = () => activeElement = accountColors.length

    $: if (activeElement >= accountColors.length) {
        active = inputValue.length >= 7 ? inputValue : '#FFFFFF'
    } else {
        active = accountColors[activeElement]
    }
    let inputValue = activeAccountColorIndex >= 0 ? '#' : active
    $: inputValue = `#${inputValue?.match(/[0-9|a-f|A-F]+/) || ''}`
    let inputColor
    $: if (inputValue.length >= 7) {
        inputColor = isBright(inputValue) ? 'gray-800' : 'white'
    }
</script>

<style type="text/scss">
    input {
        background-color: transparent;

        &.active {
            background-color: rgb(var(--account-color));
            --tw-ring-color: rgba(var(--account-color), var(--tw-ring-opacity));
            --tw-ring-opacity: 0.3;
        }
    }
</style>

<div style="--account-color: {inputValue ? hex2rgb(active) : ''}" class={classes}>
    <div class="flex flex-row mb-4">
        <Text type="h5">{title}</Text>
    </div>
    <ul class="flex flex-row justify-between">
        {#each Object.keys(AccountColors).reduce((acc, val) => /[#]/.test(val) ? acc : [...acc, val.toLowerCase()], []) as color, i}
            <li tabindex="0" class='w-8 h-8 rounded-lg ring-opacity-30 hover:ring-opacity-40 cursor-pointer flex justify-center items-center
            bg-{color}-500 hover:bg-{color}-600 focus:bg-{color}-600 ring-{color}-500' class:ring-4="{activeElement === i}"
            on:click={() => handleColorClick(i)} on:keypress={(event) => handleKeyPress(event, i)} aria-label={color}>
                {#if activeElement === i}<Icon icon="checkmark" classes="text-white" />{/if}
            </li>
        {/each}
        <li><input type="text" placeholder="#FFFFFF" pattern="[A-F0-9]{10}" maxlength="7" bind:value={inputValue} on:click={() => handleInputClick()}
            class='w-24 h-full text-16 uppercase leading-140 border border-solid
            {inputValue.length >= 7 && activeElement === accountColors.length ? `text-${inputColor} border-none` : 'text-gray-800 dark:text-white'}
            bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:border-gray-500 dark:hover:border-gray-700 p-1 rounded text-center
            {activeElement === accountColors.length ? 'ring-4' : ''}'
            class:active={activeElement === accountColors.length && inputValue.length >= 7}></li>
    </ul>
</div>
