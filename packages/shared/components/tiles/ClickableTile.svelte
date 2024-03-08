<script lang="ts">
    import { Tile } from '@ui'

    export let disabled = false
    export let selected = false
    export let classes = ''
    export let onClick: () => void
</script>

<Tile
    classes="
        hover:bg-gray-100 dark:hover:bg-gray-1000
        {disabled ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}
        {classes}
    "
    on:click={onClick}
    {selected}
>
    <slot />
</Tile>
