<script lang="typescript">
    import { Text } from 'shared/components'

    export let title = 'Color picker'

    const colors = ['blue', 'turquoise', 'lightblue', 'green', 'yellow', 'orange', 'red', 'purple']
</script>

<div>
    <div class="flex flex-row mb-6">
        <Text type="h5">{title}</Text>
    </div>
    <div class="flex flex-row justify-between">
        {#each colors as color}
            <div class='w-6 h-6 bg-{color}-500 rounded-lg'></div>
        {/each}
    </div>
</div>
