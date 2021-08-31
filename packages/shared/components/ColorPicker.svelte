<script lang="typescript">
    import { Text, Icon } from 'shared/components'
    import { AccountColors } from 'shared/lib/wallet'

    export let locale
    export let title = locale('views.pickers.color')
    export let active = AccountColors.Default

    const changeActive = color => {
        active = color
    }

    const handleKeyPress = (event, color) => event.key === 'Enter' && changeActive(color)
    const handleClick = (color) => changeActive(color)
</script>

<div>
    <div class="flex flex-row mb-4">
        <Text type="h5">{title}</Text>
    </div>
    <ul class="flex flex-row justify-between">
        {#each Object.values(AccountColors) as color}
            <li tabindex="0" class='w-8 h-8 bg-{color}-500 hover:bg-{color}-600 focus:bg-{color}-600 rounded-lg ring-{color}-500 ring-opacity-30 hover:ring-opacity-40 cursor-pointer flex justify-center items-center' class:ring-4="{color === active}"
            on:click={() => handleClick(color)} on:keypress={(event) => handleKeyPress(event, color)}
            aria-label={color}>
                {#if color === active}<Icon icon="checkmark" classes="text-white" />{/if}
            </li>
        {/each}
    </ul>
</div>
