<script lang="typescript">
    import { Text, Icon } from 'shared/components'
    import { AccountColors } from 'shared/lib/wallet'
    import resolveConfig from 'tailwindcss/resolveConfig'
    import tailwindConfig from 'shared/tailwind.config.js'

    export let active
    export let locale
    export let title = locale('views.pickers.color')

    const configColors = resolveConfig(tailwindConfig).theme.colors
    const accountColors = Object.values(AccountColors)

    let activeElement = 0

    const handleKeyPress = (event, i) => event.key === 'Enter' && (activeElement = i)
    const handleColorClick = (i) => activeElement = i
    const handleInputClick = () => activeElement = accountColors.length

    const hex2rgb = hex => hex.match(/\w\w/g)?.map(x => parseInt(x, 16)).join(',')

    $: if (activeElement >= accountColors.length) {
        active = inputValue.length >= 7 ? hex2rgb(inputValue) : ''
    } else {
        active = hex2rgb(configColors[accountColors[activeElement]]['500'])
    }

    $: inputValue = `#${inputValue?.match(/[^#]+/) || ''}`
    $: inputColor = (inputValue.length >= 7 && inputValue.match(/([A-f][0-f])/g)) ? 'black' : 'white'
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

<div style="--account-color: {active}">
    <div class="flex flex-row mb-4">
        <Text type="h5">{title}</Text>
    </div>
    <ul class="flex flex-row justify-between">
        {#each Object.values(AccountColors) as color, i}
            <li tabindex="0" class='w-8 h-8 rounded-lg ring-opacity-30 hover:ring-opacity-40 cursor-pointer flex justify-center items-center
            bg-{color}-500 hover:bg-{color}-600 focus:bg-{color}-600 ring-{color}-500' class:ring-4="{activeElement === i}"
            on:click={() => handleColorClick(i)} on:keypress={(event) => handleKeyPress(event, i)} aria-label={color}>
                {#if activeElement === i}<Icon icon="checkmark" classes="text-white" />{/if}
            </li>
        {/each}
        <li><input type="text" placeholder="#FFFFFF" pattern="[A-F0-9]{10}" maxlength="7" bind:value={inputValue} on:click={() => handleInputClick()}
            class='w-24 h-full text-16 leading-140 border border-solid text-gray-800 dark:text-white bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700
            hover:border-gray-500 dark:hover:border-gray-700 p-1 rounded text-center {activeElement === accountColors.length ? 'ring-4' : ''}'
            class:active={activeElement === accountColors.length} style={activeElement === accountColors.length ? `color: ${inputColor}` : ''}></li>
    </ul>
</div>
