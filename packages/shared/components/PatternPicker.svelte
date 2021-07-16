<script lang="typescript">
    import { Text, Icon } from "shared/components"

    export let locale
    export let title = locale('views.pickers.pattern')
    export let color = "turquoise"
    export let active = ""

    const patterns = ["", "clover", "circles", "clouds", "shapes", "wind", "rain", "organic"]

    const changeActive = pattern => {
        active = pattern
    }

    const handleKeyPress = (event, pattern) => event.key === 'Enter' && changeActive(pattern)
    const handleClick = (pattern) => changeActive(pattern)
</script>

<div>
    <div class="flex flex-row mb-4">
        <Text type="h5">{title}</Text>
    </div>
    <ul class="grid grid-cols-4 grid-rows-2 gap-4">
        {#each patterns as pattern}
            <li
                class="h-20 rounded-lg {pattern === active ? `bg-${color}-500 opacity-100 ring-${color}-500 ring-4 ring-opacity-30 hover:ring-opacity-40 focus:ring-opacity-40` : 'bg-gray-300 hover:bg-{color}-500 focus:bg-{color}-500 opacity-80 hover:opacity-100 focus:opacity-100'} bg-no-repeat bg-center bg-cover bg cursor-pointer flex justify-center items-center"
                style={pattern ? `background-image: url("assets/patterns/${pattern}.svg");` : null}
                on:click={() => handleClick(pattern)} on:keypress={(event) => handleKeyPress(event, pattern)}
                tabindex="0" aria-label={pattern}>
                {#if pattern === active}<Icon icon="checkmark" classes="bg-green-600 text-white rounded-full" />{/if}
            </li>
        {/each}
    </ul>
</div>
