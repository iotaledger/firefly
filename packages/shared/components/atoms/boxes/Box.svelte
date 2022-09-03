<script lang="typescript">
    export let col = false
    export let row = false
    export let clearBackground = false
    export let clearPadding = false
    export let backgroundColor = 'gray-50'
    export let darkBackgroundColor = 'gray-850'
    export let classes = ''
</script>

<box
    class={`
        w-full flex rounded-lg
        ${col ? 'flex-col' : ''}
        ${row ? 'flex-row' : ''}
        ${clearPadding ? '' : 'px-4 py-4'}
        ${backgroundColor && !clearBackground ? 'bg-' + backgroundColor : ''}  
        ${darkBackgroundColor && !clearBackground ? 'dark:bg-' + darkBackgroundColor : ''}
        ${classes}
    `}
>
    <slot />
</box>
