<script lang="typescript">
    export let classes: string = ''
    export let overrideColor: boolean = false
</script>

<hr class="border-t border-solid {!overrideColor && 'border-gray-200 dark:border-gray-700'} {classes}" />
