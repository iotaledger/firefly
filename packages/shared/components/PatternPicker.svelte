<script lang="typescript">
    import { Text } from "shared/components"

    export let title = "Pattern picker"

    const patterns = [0, 1, 2, 3, 4, 5, 6, 7]
</script>

<div>
    <div class="flex flex-row mb-4">
        <Text type="h5">{title}</Text>
    </div>
    <div class="grid grid-cols-4 grid-rows-2 gap-4">
        {#each patterns as pattern}
            <div class="h-20 bg-gray-500 rounded-lg flex justify-center items-center">{pattern}</div>
        {/each}
    </div>
</div>
