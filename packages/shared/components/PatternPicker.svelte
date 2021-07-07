<script lang="typescript">
    import { Text, Pattern } from "shared/components"

    export let title = "Pattern picker"
    export let color = "turquoise"

    const patterns = ["", "circles", "clouds", "clover", "organic", "rain", "shapes", "wind"]
</script>

<div>
    <div class="flex flex-row mb-4">
        <Text type="h5">{title}</Text>
    </div>
    <div class="grid grid-cols-4 grid-rows-2 gap-4">
        {#each patterns as pattern}
            <Pattern classes='h-20 rounded-lg bg-{color}-500' {pattern} />
        {/each}
    </div>
</div>
