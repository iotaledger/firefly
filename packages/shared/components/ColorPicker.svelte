<script lang="typescript">
    import { Text } from 'shared/components'

    export let title = 'Color picker'
    export let active = 'green'

    const colors = ['blue', 'lightblue', 'turquoise', 'green', 'yellow', 'orange', 'red', 'purple']

    const handleClick = color => {
        active = color;
    }
</script>

<div>
    <div class="flex flex-row mb-4">
        <Text type="h5">{title}</Text>
    </div>
    <div class="flex flex-row justify-between">
        {#each colors as color}
            <div class='w-8 h-8 bg-{color}-500 hover:bg-{color}-600 rounded-lg ring-{color}-500 ring-opacity-30 hover:ring-opacity-40 cursor-pointer' class:ring-4="{color === active}" on:click={() => handleClick(color)}></div>
        {/each}
    </div>
</div>
