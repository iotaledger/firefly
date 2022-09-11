<script lang="typescript">
    import { Tile } from 'shared/components'

    export let disabled = false
    export let classes = ''
    export let onClick: () => void
</script>

<Tile
    classes="
        hover:bg-gray-100 dark:hover:bg-gray-1000
        {disabled ? 'opacity-50 pointer-events-handlers-none' : 'cursor-pointer'}
        {classes}
    "
    on:click={onClick}
>
    <slot />
</Tile>
