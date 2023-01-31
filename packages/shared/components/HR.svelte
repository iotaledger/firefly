<script lang="ts">
    export let classes: string = ''
    export let hidden: boolean = false
    export let overrideColor: boolean = false
</script>

<hr
    class="border-t border-solid {hidden
        ? 'border-gray-100 dark:border-gray-800'
        : !overrideColor && 'border-gray-200 dark:border-gray-800'} {classes}"
/>
