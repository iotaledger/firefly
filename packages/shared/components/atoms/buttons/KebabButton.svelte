<script lang="typescript">
    export let onClick = async (): Promise<void> => {}
    export let classes = ''
</script>

<button
    on:click={onClick}
    class="px-2 py-3 flex flex-row space-x-1 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white dark:bg-opacity-50 rounded-lg {classes}"
>
    {#each Array(3) as _}
        <svg width="4" height="4" viewBox="0 0 4 4">
            <circle cx="2" cy="2" r="2" class="fill-current" />
        </svg>
    {/each}
</button>
