<script lang="ts">
    export let col: boolean = false
    export let row: boolean = false
    export let clearBackground: boolean = false
    export let clearPadding: boolean = false
    export let backgroundColor: string = 'gray-50'
    export let darkBackgroundColor: string = 'gray-850'
    export let classes: string = ''
</script>

<box-content
    class="w-full flex rounded-lg
    {clearPadding ? '' : 'px-4 py-4'}
    {backgroundColor && !clearBackground ? 'bg-' + backgroundColor : ''}
    {darkBackgroundColor && !clearBackground ? 'dark:bg-' + darkBackgroundColor : ''} {classes}"
    class:flex-col={col}
    class:flex-row={row}
>
    <slot />
</box-content>
