<script lang="typescript">
    import { Text } from 'shared/components'

    export let title = 'Color picker'
    export let active = 'turquoise'

    const colors = ['blue', 'lightblue', 'turquoise', 'green', 'yellow', 'orange', 'red', 'purple']
</script>

<div>
    <div class="flex flex-row mb-4">
        <Text type="h5">{title}</Text>
    </div>
    <div class="flex flex-row justify-between">
        {#each colors as color}
            <div class='w-8 h-8 bg-{color}-500 hover:bg-{color}-600 rounded-lg ring-{color}-100 hover:ring-{color}-200 cursor-pointer' class:ring-4="{color === active}"></div>
        {/each}
    </div>
</div>
