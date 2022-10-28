<script lang="typescript">
    import { AccountColors } from '@core/account'
    import { localize } from '@core/i18n'
    import { Icon, Text } from 'shared/components'
    import { isBright } from 'shared/lib/helpers'

    export let active: string
    export let classes: string = ''
    export let title: string = localize('views.picker.color.title')

    const accountColors = Object.values(AccountColors).filter((c) => /[#]/.test(c as string)) as string[]
    const activeAccountColorIndex = accountColors.findIndex((_, i) => accountColors[i] === active)

    let activeElement: number = activeAccountColorIndex >= 0 ? activeAccountColorIndex : accountColors.length
    let inputValue: string = activeAccountColorIndex >= 0 ? '#FFFFFF' : active
    let inputColor: string

    const handleKeyPress = (event, i) => event.key === 'Enter' && (activeElement = i)
    const handleColorClick = (i) => (activeElement = i)

    $: if (activeElement >= accountColors.length) {
        active = inputValue.length >= 7 ? inputValue : '#FFFFFF'
    } else {
        active = accountColors[activeElement]
    }

    $: inputValue = `#${/[0-9|a-f|A-F]+/.exec(inputValue) || ''}`

    $: if (inputValue.length >= 7) {
        inputColor = isBright(inputValue) ? 'gray-800' : 'white'
    } else {
        inputColor = 'gray-800'
    }

    function hex2rgb(hex: string): string {
        hex = hex.length >= 7 ? hex : '#FFFFFF'
        return hex
            .match(/\w\w/g)
            ?.map((x) => parseInt(x, 16))
            .join(',')
    }
</script>

<div
    style="--account-color: {inputValue ? hex2rgb(active) : ''}; --custom-color: {hex2rgb(inputValue)};"
    class={classes}
>
    <div class="flex flex-row mb-4">
        <Text type="h5">{title}</Text>
    </div>
    <ul class="flex flex-row flex-wrap gap-3.5">
        {#each Object.keys(AccountColors).reduce((acc, val) => (/[#]/.test(val) ? acc : [...acc, val.toLowerCase()]), []) as color, i}
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
    </ul>
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
</style>
