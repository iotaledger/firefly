<script lang="ts">
    export let col: boolean = false
    export let row: boolean = false
    export let backgroundColor: string = ''
    export let centered: boolean = false
    export let padding: string = ''
    export let classes = ''
</script>

<box-content
    class="w-full flex rounded-lg {padding} {backgroundColor} {classes}"
    class:flex-col={col}
    class:flex-row={row}
    class:justify-center={centered}
>
    <slot />
</box-content>
