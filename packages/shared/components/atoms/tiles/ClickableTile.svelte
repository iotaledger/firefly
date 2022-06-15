<script lang="typescript">
    import { Tile } from 'shared/components'

    export let classes = ''
    export let onClick: () => unknown
</script>

<Tile
    classes="
        bg-gray-50 dark:bg-gray-900
        hover:bg-gray-200 dark:hover:bg-gray-700
        cursor-pointer
        {classes}
    "
    on:click={onClick}
>
    <slot />
</Tile>
