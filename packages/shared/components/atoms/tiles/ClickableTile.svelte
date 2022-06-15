<script lang="typescript">
    import Tile from './Tile.svelte'

    export let classes = ''
    export let onClick: () => unknown
</script>

<Tile
    classes="
        hover:bg-gray-200 dark:hover:bg-gray-700
        cursor-pointer
        {classes}
    "
    on:click={onClick}
>
    <slot />
</Tile>
