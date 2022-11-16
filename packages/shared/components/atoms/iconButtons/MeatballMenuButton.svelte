<script lang="typescript">
    import { clickOutside } from '@core/utils'

    export let onClick: (event?: any) => void
    export let classes = ''
    export let meatballCount = 3

    let active = false

    function handleClick(event: any): void {
        active = !active
        onClick(event)
    }

    function handleClickOutside(): void {
        active = false
    }
</script>

<button
    on:click|stopPropagation={handleClick}
    use:clickOutside
    on:clickOutside={handleClickOutside}
    class="
        flex flex-row space-x-1 px-2 py-3
        text-gray-500 dark:text-white rounded-lg
        hover:bg-gray-50 dark:hover:bg-gray-900 dark:hover:bg-opacity-50
        {active ? 'bg-gray-50 dark:bg-gray-900 dark:bg-opacity-50' : ''}
        {classes}
    "
>
    {#each Array(meatballCount) as _}
        <svg width="4" height="4" viewBox="0 0 4 4">
            <circle cx="2" cy="2" r="2" class="fill-current" />
        </svg>
    {/each}
</button>
