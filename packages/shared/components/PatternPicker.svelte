<script lang="typescript">
    import { Text, Pattern } from "shared/components"

    export let locale
    export let title = locale('views.pickers.pattern')
    export let color = "turquoise"
    export let active = ""

    const patterns = ["", "clover", "circles", "clouds", "shapes", "wind", "rain", "organic"]

    const handleClick = pattern => {
        active = pattern;
    }
</script>

<div>
    <div class="flex flex-row mb-4">
        <Text type="h5">{title}</Text>
    </div>
    <div class="grid grid-cols-4 grid-rows-2 gap-4">
        {#each patterns as pattern}
            <Pattern classes='h-20 rounded-lg {pattern === active ? `bg-${color}-500 opacity-100 ring-${color}-500 ring-4 ring-opacity-30 hover:ring-opacity-40` : 'bg-gray-300 hover:bg-{color}-500 opacity-80 hover:opacity-100'}' {pattern} onClick={() => handleClick(pattern)} />
        {/each}
    </div>
</div>
