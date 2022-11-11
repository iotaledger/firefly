<script lang="typescript">
    export let onClick: (event?: any) => void
    export let classes = ''
    export let meatballCount = 3
</script>

<button
    on:click|stopPropagation={(event) => onClick(event)}
    class="
        flex flex-row space-x-1 px-2 py-3
        text-gray-500 dark:text-white dark:bg-opacity-10 rounded-lg
        hover:bg-gray-50 hover:dark:bg-gray-900
        focus:bg-gray-50 focus:dark:bg-gray-900
        {classes}
    "
>
    {#each Array(meatballCount) as _}
        <svg width="4" height="4" viewBox="0 0 4 4">
            <circle cx="2" cy="2" r="2" class="fill-current" />
        </svg>
    {/each}
</button>
