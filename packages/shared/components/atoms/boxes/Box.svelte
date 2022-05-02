<script lang="typescript">
    export let col: boolean = false
    export let row: boolean = false
    export let clearBackground: boolean = false
    export let clearPadding = false
    export let backgroundColor: string = 'gray-50'
    export let darkBackgroundColor: string = 'gray-850'
    export let classes: string = ''
</script>

<box
    class={`
        w-full flex justify-between items-center rounded-lg
        ${col ? 'flex-col' : ''}
        ${row ? 'flex-row' : ''}
        ${!clearPadding ? 'px-4 py-4' : ''}
        ${!clearBackground && backgroundColor ? 'bg-' + backgroundColor : ''}  
        ${!clearBackground && darkBackgroundColor ? 'dark:bg-' + darkBackgroundColor : ''}
        ${classes}
    `}
>
    <slot />
</box>
