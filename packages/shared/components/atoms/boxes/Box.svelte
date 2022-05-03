<script lang="typescript">
    export let col: boolean = false
    export let row: boolean = false
    export let clearBackground: boolean = false
    export let backgroundColor: string = 'gray-50'
    export let darkBackgrounColor: string = 'gray-50'
    export let classes: string = ''
</script>

<box
    class={`
        w-full flex justify-between items-center rounded-lg
        ${col ? 'flex-col' : ''}
        ${row ? 'flex-row' : ''}
        ${!clearBackground ? 'px-4 py-4' : ''}
        ${!clearBackground && backgroundColor ? 'bg-' + backgroundColor : ''}  
        ${!clearBackground && darkBackgrounColor ? 'dark:bg-' + darkBackgrounColor : ''}
        ${classes}
    `}
>
    <slot />
</box>
