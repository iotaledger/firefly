<script lang="typescript">
    export let onClick: () => void
    export let includeBackground = false
    export let classes = ''
    export let meatballCount = 3
</script>

<button
    on:click|stopPropagation={onClick}
    class="
        flex flex-row space-x-1 px-2 py-3
        text-gray-500 dark:text-white hover:text-gray-600 dark:hover:text-gray-300
        {includeBackground ? 'bg-gray-50 dark:bg-gray-900 dark:bg-opacity-50 rounded-lg text-gray-900' : ''}
        {classes}
    "
>
    {#each Array(meatballCount) as _}
        <svg width="4" height="4" viewBox="0 0 4 4">
            <circle cx="2" cy="2" r="2" class="fill-current" />
        </svg>
    {/each}
</button>
